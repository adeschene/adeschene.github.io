const tabs = document.querySelectorAll("[data-tab-target]");
const tabContents = document.querySelectorAll("[data-tab-content]");

// Handle about section tabs
tabs.forEach(tab => tab.addEventListener('click', () => tabClickHandler(tab)))

function tabClickHandler(tab) {
  const target = document.querySelector(tab.dataset.tabTarget);
  tabContents.forEach(tabContent => {
    tabContent.classList.remove('active');
  });
  tabs.forEach(tab => {
    tab.classList.remove('active');
  });
  target.classList.add('active');
  tab.classList.add('active');
}

function hideTabsShowAll(x) {
  if (x.matches) // If media query matches
    tabContents.forEach(tabContent => tabContent.classList.add('active'));
  else
    tabClickHandler(tabs[0]);
}

let x = window.matchMedia("(max-width: 65rem)");
hideTabsShowAll(x); // Call listener function at run time
x.addListener(hideTabsShowAll); // Attach listener function on state changes