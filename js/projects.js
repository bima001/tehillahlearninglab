document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const projectCount = document.getElementById('project-count');

  function filterProjects(button) {
    const selectedFilter = button.dataset.filter;
    let visibleCount = 0;

    filterButtons.forEach((filterButton) => {
      const isSelected = filterButton === button;
      filterButton.classList.toggle('active', isSelected);
      filterButton.setAttribute('aria-pressed', String(isSelected));
    });

    projectCards.forEach((card) => {
      const shouldShow = selectedFilter === 'all' || card.dataset.category === selectedFilter;
      card.hidden = !shouldShow;
      if (shouldShow) visibleCount += 1;
    });

    if (projectCount) {
      projectCount.textContent = `${String(visibleCount).padStart(2, '0')} ${visibleCount === 1 ? 'PROJECT' : 'PROJECTS'} / ${button.textContent.toUpperCase()}`;
    }
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => filterProjects(button));
  });

  const activeFilter = document.querySelector('.filter-btn.active');
  if (activeFilter) filterProjects(activeFilter);
});
