import { supabase } from '../supabaseClient';

// Returns a user with their courses, in format of
// {id (user uuid), email, first_name, last_name, courses (list of course objects)}
export const getUserWithCourses = async (userId) => {
    const { data, error } = await supabase
      .from('user_info')
      .select(`
        *,
        courses (*)
      `)
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user with courses:', error);
      return null;
    }
    
    return data;
};


export const getUserWithCompleteData = async (userId) => {
    // First fetch user, courses, topics, and contents
    const { data, error } = await supabase
      .from('user_info')
      .select(`
        *,
        courses (
          *,
          topics (
            *,
            contents (*)
          )
        )
      `)
      .eq('id', userId)
      .single();
  
    if (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  
    // Then fetch all conceptual and application competencies scoped to user
    const [conceptualRes, applicationRes] = await Promise.all([
      supabase
        .from('conceptual_competencies')
        .select('*')
        .eq('user_id', userId),
      supabase
        .from('application_competencies')
        .select('*')
        .eq('user_id', userId)
    ]);
  
    if (conceptualRes.error || applicationRes.error) {
      console.error('Error fetching competencies:', {
        conceptualError: conceptualRes.error,
        applicationError: applicationRes.error
      });
      return data; // return what we have lol
    }
  
    const conceptualData = conceptualRes.data;
    const applicationData = applicationRes.data;
  
    // Attach competencies at the correct topic level
    if (data && data.courses) {
      data.courses.forEach(course => {
        course.topics.forEach(topic => {
          topic.conceptual_competencies = conceptualData.filter(
            comp =>
              comp.course_id === course.id &&
              comp.topic_id === topic.id &&
              comp.user_id === userId
          );
  
          topic.application_competencies = applicationData.filter(
            comp =>
              comp.course_id === course.id &&
              comp.topic_id === topic.id &&
              comp.user_id === userId
          );
        });
      });
    }
  
    return data;
  };
  
// Returns a list of topics for a given course, in format of
// { id (unique), course_id (matching input), title, conceptual_score, application_score }
export const getCourseTopics = async (courseId) => {
    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .eq('course_id', courseId)
      .order('title');
    
    if (error) {
      console.error('Error fetching topics:', error);
      return [];
    }
    
    return data;
};

// Returns a list of contents for a given topic, in format of
// { id (unique), topic_id (matching input), title, content, created_at }
export const getAllTopicContent = async (topicId) => {
    const { data, error } = await supabase
      .from('contents')
      .select('*')
      .eq('topic_id', topicId)
    
    if (error) {
    console.error('Error fetching content:', error);
    return [];
    }
    
    return data;
};

export const createTopic = async (topicData) => {
  const { data, error } = await supabase
    .from('topics')
    .insert([topicData])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating topic:', error);
    return null;
  }
  
  return data;
};

// Returns an object with the conceptual and application competencies in separate lists
export const getTopicCompetencies = async (topicId) => {
    const [conceptualRes, applicationRes] = await Promise.all([
      supabase
        .from('conceptual_competencies')
        .select('*')
        .eq('topic_id', topicId),
      
      supabase
        .from('application_competencies')
        .select('*')
        .eq('topic_id', topicId)
    ]);
  
    const conceptualError = conceptualRes.error;
    const applicationError = applicationRes.error;
  
    if (conceptualError || applicationError) {
      console.error('Error fetching competencies:', conceptualError || applicationError);
      return {
        conceptual: [],
        application: []
      };
    }
  
    return {
      conceptual: conceptualRes.data,
      application: applicationRes.data
    };
};
  
// Returns a list of courses for a given usser, in format of
// { id (unique), user_id (matching input), title, created_at}
export const getUserCourses = async (userId) => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
  
  return data;
};

// input: { user_id, title }, returns the row created
export const createCourse = async (courseData) => {
    const { data, error } = await supabase
      .from('courses')
      .insert([courseData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating course:', error);
      return null;
    }
    
    return data;
};

// Returns a course with its topics and contents 
export const getCourseWithTopicsAndContent = async (courseId) => {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        topics (
          *,
          contents (*)
        )
      `)
      .eq('id', courseId)
      .single();
    
    if (error) {
      console.error('Error fetching course with topics:', error);
      return null;
    }
    
    return data;
};

// Post pinecone queried course roadmap into supabase instance
export const postCourseRoadmap = async (userId, course_roadmap, course_name) => {
  const course_id = crypto.randomUUID();
  
  createCourseSession(userId, course_id, 0, 0, {}, 0)
  const { data: courseData, error: courseError } = await supabase
    .from('courses')
    .insert([{id: course_id, user_id: userId, title: course_name, complete: false}])
    .select()
    .single();
  console.log("posted course id")
  for (const [index, course_topic] of course_roadmap.entries())  {
    const topic = course_topic.topic
    const topic_id = crypto.randomUUID();

    const contents = course_topic.contents.result.hits
    const { data: topicData, error: topicError } = await supabase
      .from('topics')
      .insert([{id: topic_id, course_id: course_id, title: topic, conceptual_score: 0, application_score: 0, topic_level: index, complete: false}])
      .select()
      .single()
    
    console.log("posted topic id")
    for (const content_hit of contents) {
      const content_id = crypto.randomUUID();
      const { data: contentData, error: contentError } = await supabase
      .from('contents')
      .insert([{id: content_id, topic_id: topic_id, content: content_hit, complete: false, topic_match: 0}])
      .select()
      .single()

    }
  }
}

// List of conceptual competencies for a given user, course, and topic
export const getConceptualCompetencies = async (userId, courseId, topicId) => {
  const { data, error } = await supabase
    .from('conceptual_competencies')
    .select('*')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .eq('topic_id', topicId);
  
  if (error) {
    console.error('Error fetching conceptual competencies:', error);
    return [];
  }
  
  return data;
};

// List of application competencies for a given user, course, and topic
export const getApplicationCompetencies = async (userId, courseId, topicId) => {
  const { data, error } = await supabase
      .from('application_competencies')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .eq('topic_id', topicId);
      
  if (error) {
      console.error('Error fetching application competencies:', error);
      return [];
  }

  return data;
};

  
export const updateConceptualCompetency = async (competencyId, score) => {
  const { data, error } = await supabase
      .from('conceptual_competencies')
      .update({ score })
      .eq('id', competencyId)
      .select()
      .single();

  if (error) {
      console.error('Error updating conceptual competency:', error);
      return null;
  }

  return data;
};

export const updateApplicationCompetency = async (competencyId, score) => {
  const { data, error } = await supabase
      .from('application_competencies')
      .update({ score })
      .eq('id', competencyId)
      .select()
      .single();

  if (error) {
      console.error('Error updating application competency:', error);
      return null;
  }

return data;
};

// new queries begin here

export const getSessionObject = async (userId, courseId, sessionNumber) => {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .eq('session_number', sessionNumber);
    
  if (error) {
    console.error('Error fetching session content:', error);
    return null;

  }
  return data;
};

export const updateUserCurrentSession = async (userId, courseId, sessionUpdate) => {
  const { data, error } = await supabase
    .from('courses')
    .update({ current_session: sessionUpdate })
    .eq('user_id', userId)
    .eq('course_id', courseId);
    
  if (error) {
    console.error('Error updating user current session:', error);
    return null;
  }

  return data;
};  

export const updateSessionContent = async (userId, courseId, sessionNumber, contentUpdate) => {
  const { data, error } = await supabase
    .from('sessions')
    .update({ content: contentUpdate })
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .eq('session_number', sessionNumber);
      
  if (error) {
    console.error('Error updating session content:', error);
    return null;
  }

  return data;
};


export const createCourseSession = async (userId, courseId) => {
  const session_id = crypto.getRandomValues()
  const { data, error } = await supabase
    .from('sessions')
    .insert({id: session_id , user_id: userId, course_id: courseId, session_number: 0, curr_topic_index: 0, completed_contents: {}, curr_content: 0})
      
  if (error) {
    console.error('Error updating session content:', error);
    return null;
  }

  return data;
};


export const getCurrentSession = async (userId, courseId) => {
  console.log("Called")
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .single();

    if (error) {
    console.error('Error fetching session:', error);
    return null;
    }

  return data;
};


export const getSessionTopic = async (courseId, topic_level) => {
  const { data, error } = await supabase
    .from('topics')
    .select('*')
    .eq('course_id', courseId)
    .eq('topic_level', topic_level)
    .single();

    if (error) {
    console.error('Error fetching session:', error);
    return null;
    }

  return data;
}

export const getSessionContents = async (topic_id) => {
  const { data, error } = await supabase
    .from('contents')
    .select('*')
    .eq('topic_id', topic_id)

    if (error) {
    console.error('Error fetching session:', error);
    return null;
    }

  return data;
}

