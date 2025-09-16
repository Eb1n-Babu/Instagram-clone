document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('postModal');
    const openBtn = document.getElementById('openPostModal');
    const closeBtn = document.querySelector('.close-button');
    const likeButtons = document.querySelectorAll('.like-btn');
    const replyButtons = document.querySelectorAll('.reply-btn');
    const commentButtons = document.querySelectorAll('.comment-btn[data-post-id]');
    const viewAllButtons = document.querySelectorAll('.view-all-comments');
    let inactivityTimeout = null;
    let commentsTimeout = {};

    // Open modal
    openBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    // Close modal on close button click
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            modal.style.display = 'none';
        }
    });

    // Toggle like button color
    likeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const isLiked = button.getAttribute('data-liked') === 'true';
            button.setAttribute('data-liked', !isLiked);
            button.classList.toggle('liked', !isLiked);
        });
    });

    // Toggle reply form visibility - Instagram style
    replyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const commentId = button.getAttribute('data-comment-id');
            const commentThread = document.querySelector(`.comment-thread[data-comment-id="${commentId}"]`);
            const replyFormContainer = commentThread.querySelector('.reply-form-container');

            if (replyFormContainer) {
                // Close all other reply forms
                document.querySelectorAll('.reply-form-container').forEach(container => {
                    if (container !== replyFormContainer) {
                        container.style.display = 'none';
                    }
                });
                // Toggle current
                const isVisible = replyFormContainer.style.display === 'block';
                replyFormContainer.style.display = isVisible ? 'none' : 'block';
                if (!isVisible) {
                    const input = replyFormContainer.querySelector('input[name="text"]');
                    setTimeout(() => input.focus(), 100); // Small delay for smooth animation

                    // Clear any existing reply form timeout
                    if (inactivityTimeout) {
                        clearTimeout(inactivityTimeout);
                    }

                    // Start inactivity timer for reply form
                    inactivityTimeout = setTimeout(() => {
                        replyFormContainer.style.display = 'none';
                    }, 10000); // 10 seconds

                    // Reset timer on input interaction
                    input.addEventListener('input', () => {
                        clearTimeout(inactivityTimeout);
                        inactivityTimeout = setTimeout(() => {
                            replyFormContainer.style.display = 'none';
                        }, 10000);
                    });

                    // Reset timer on focus
                    input.addEventListener('focus', () => {
                        clearTimeout(inactivityTimeout);
                        inactivityTimeout = setTimeout(() => {
                            replyFormContainer.style.display = 'none';
                        }, 10000);
                    });

                    // Clear timer if form is submitted or loses focus
                    input.addEventListener('blur', () => {
                        clearTimeout(inactivityTimeout);
                        inactivityTimeout = setTimeout(() => {
                            replyFormContainer.style.display = 'none';
                        }, 10000);
                    });

                    replyFormContainer.querySelector('form').addEventListener('submit', () => {
                        clearTimeout(inactivityTimeout);
                    });
                } else {
                    clearTimeout(inactivityTimeout);
                }
            } else {
                console.error(`Reply form container not found for comment ID: ${commentId}`);
            }
        });
    });

    // Scroll to comments when comment button is clicked (Instagram style)
    commentButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const postId = button.getAttribute('data-post-id');
            const commentsSection = document.querySelector(`.feed-post[data-post-id="${postId}"] .comments-section`);
            if (commentsSection) {
                commentsSection.scrollIntoView({ behavior: 'smooth' });
                // Focus main comment form
                const mainInput = commentsSection.querySelector('.main-comment-form input[name="text"]');
                if (mainInput) {
                    mainInput.focus();
                }
            }
        });
    });

    // View all comments (Instagram style)
    viewAllButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const postId = button.getAttribute('data-post-id');
            const commentsContainer = document.querySelector(`.comments-container[data-post-id="${postId}"]`);
            const viewCommentsDiv = button.closest('.view-comments');
            if (commentsContainer && viewCommentsDiv) {
                // Show all comment threads
                commentsContainer.querySelectorAll('.comment-thread').forEach((thread, index) => {
                    thread.style.display = 'block';
                });
                // Hide the "View all comments" button
                viewCommentsDiv.style.display = 'none';
                // Scroll to comments section
                const commentsSection = commentsContainer.closest('.comments-section');
                if (commentsSection) {
                    commentsSection.scrollIntoView({ behavior: 'smooth' });
                }
                // Start inactivity timer for comments
                clearTimeout(commentsTimeout[postId]);
                commentsTimeout[postId] = setTimeout(() => {
                    commentsContainer.querySelectorAll('.comment-thread').forEach((thread, index) => {
                        if (index >= 2) {
                            thread.style.display = 'none';
                        }
                    });
                    viewCommentsDiv.style.display = 'block';
                }, 10000); // 10 seconds
                // Reset timer on interaction with comments section
                commentsContainer.addEventListener('click', () => {
                    clearTimeout(commentsTimeout[postId]);
                    commentsTimeout[postId] = setTimeout(() => {
                        commentsContainer.querySelectorAll('.comment-thread').forEach((thread, index) => {
                            if (index >= 2) {
                                thread.style.display = 'none';
                            }
                        });
                        viewCommentsDiv.style.display = 'block';
                    }, 10000);
                });
                commentsContainer.addEventListener('input', () => {
                    clearTimeout(commentsTimeout[postId]);
                    commentsTimeout[postId] = setTimeout(() => {
                        commentsContainer.querySelectorAll('.comment-thread').forEach((thread, index) => {
                            if (index >= 2) {
                                thread.style.display = 'none';
                            }
                        });
                        viewCommentsDiv.style.display = 'block';
                    }, 10000);
                });
            } else {
                console.error(`Comments container or view-comments div not found for post ID: ${postId}`);
            }
        });
    });
});