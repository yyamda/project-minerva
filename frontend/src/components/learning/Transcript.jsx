"use client";

import { useState, useEffect } from "react";

export default function Transcript() {
    const [transcript, setTranscript] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Mock transcript data - in a real implementation, you would fetch this from a transcript API
    const mockTranscript = `[00:00:00] Welcome to this tutorial on machine learning fundamentals.
[00:00:05] In this video, we'll cover the basics of supervised learning, unsupervised learning, and neural networks.
[00:00:15] Let's start with supervised learning, which is one of the most common approaches in machine learning.
[00:00:25] Supervised learning involves training a model on labeled data, where we have input features and corresponding output labels.
[00:00:35] The goal is to learn a mapping from inputs to outputs so that we can make predictions on new, unseen data.
[00:00:45] Common examples include classification tasks like spam detection and regression tasks like predicting house prices.
[00:00:55] Now let's move on to unsupervised learning, which deals with unlabeled data.
[00:01:05] In unsupervised learning, we try to find hidden patterns or structures in the data without any predefined labels.
[00:01:15] Clustering is a popular unsupervised learning technique where we group similar data points together.
[00:01:25] Dimensionality reduction is another important unsupervised learning method that helps us visualize high-dimensional data.
[00:01:35] Finally, let's discuss neural networks, which are inspired by the human brain.
[00:01:45] Neural networks consist of interconnected nodes called neurons that process information in layers.
[00:01:55] Each connection has a weight that determines how much influence one neuron has on another.
[00:02:05] Deep learning refers to neural networks with many layers, allowing them to learn complex patterns.
[00:02:15] Convolutional neural networks are particularly effective for image recognition tasks.
[00:02:25] Recurrent neural networks are designed to handle sequential data like text and speech.
[00:02:35] That concludes our overview of machine learning fundamentals. Thank you for watching!`;

    useEffect(() => {
        // Simulate loading transcript data
        setIsLoading(true);
        setTimeout(() => {
            setTranscript(mockTranscript);
            setIsLoading(false);
        }, 1000);
    }, []);

    const formatTranscript = (text) => {
        return text.split('\n').map((line, index) => {
            if (line.trim() === '') return null;
            
            const timeMatch = line.match(/\[(\d{2}:\d{2}:\d{2})\]/);
            if (timeMatch) {
                const time = timeMatch[1];
                const content = line.replace(/\[\d{2}:\d{2}:\d{2}\]/, '').trim();
                return (
                    <div key={index} className="transcript-line">
                        <span className="timestamp">{time}</span>
                        <span className="content">{content}</span>
                    </div>
                );
            }
            return (
                <div key={index} className="transcript-line">
                    <span className="content">{line}</span>
                </div>
            );
        });
    };

    return (
        <div className="transcript-container">
            <h3 className="transcript-title">Video Transcript</h3>
            
            {isLoading && (
                <div className="loading">
                    <p>Loading transcript...</p>
                </div>
            )}
            
            {error && (
                <div className="error">
                    <p>Error loading transcript: {error}</p>
                </div>
            )}
            
            {transcript && !isLoading && (
                <div className="transcript-content">
                    {formatTranscript(transcript)}
                </div>
            )}
            
        </div>
    );
} 