document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('postModal');
    const openBtn = document.getElementById('openPostModal');
    const closeBtn = document.querySelector('.close-button');

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
});