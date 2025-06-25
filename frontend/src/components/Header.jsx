"use client";

import { useRouter } from "next/navigation";

export default function Header({ title, showBackButton = true, backPath = "/" }) {
    const router = useRouter();

    const handleBack = () => {
        router.push(backPath);
    };

    return (
        <div className="header-section">
            <h1>{title}</h1>
            {showBackButton && (
                <button onClick={handleBack} className="back-button">
                    Back to Home
                </button>
            )}

            <style jsx>{`
                .header-section {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                    padding-bottom: 20px;
                    border-bottom: 2px solid #e2e8f0;
                }

                .header-section h1 {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #1e293b;
                    margin: 0;
                }

                .back-button {
                    background-color: #3b82f6;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 6px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }

                .back-button:hover {
                    background-color: #2563eb;
                }

                /* Responsive design */
                @media (max-width: 1024px) {
                    .header-section {
                        flex-direction: column;
                        gap: 15px;
                        align-items: flex-start;
                    }
                }

                @media (max-width: 768px) {
                    .header-section h1 {
                        font-size: 1.5rem;
                    }
                }
            `}</style>
        </div>
    );
}