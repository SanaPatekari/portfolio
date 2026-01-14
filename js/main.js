const PROJECTS = [
  {
    title: "Diabetes Risk Classification Using ML Algorithms",
    description:
      "Binary diabetes prediction using the WiDS Datathon 2021 dataset. Built an end-to-end ML pipeline with preprocessing, feature engineering, class imbalance handling, and model tuning.",
    /*bullets: [
      "Applied preprocessing and feature engineering to improve data quality and signal",
      "Handled class imbalance to improve performance on minority cases",
      "Trained and tuned Logistic Regression, SVM, and Naive Bayes models"
    ],*/
    tags: ["Machine Learning", "Classification", "Imbalanced Data", "Python"],
    //image: "assets/images/projects/diabetes-risk-ml.png",
    github: "https://github.com/SanaPatekari/DiabeticsPrediction",
    demo: ""
  },
  {
    title: "Skin Lesion Classification and Segmentation",
    description:
      "Computer vision workflow for benign vs malignant classification and lesion boundary segmentation with strong performance under severe class imbalance.",
    /*bullets: [
      "Achieved 93% recall for benign vs malignant classification using VGG16/CNN variants on 60,000+ images",
      "Improved generalization with artifact removal and augmentations (brightness, rotation, zoom)",
      "Built U-Net segmentation (ResNet34 encoder) on ISIC 2018 and reached 89% DICE score"
    ],*/
    tags: ["Computer Vision", "Deep Learning", "Segmentation", "PyTorch"],
    //image: "assets/images/projects/skin-lesion-classification-segmentation.png",
    github: "https://github.com/SanaPatekari/ISIC_Image_Segmentation",
    demo: ""
  }
];

function getUniqueTags(projects) {
  const set = new Set();
  projects.forEach(p => (p.tags || []).forEach(t => set.add(t)));
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

function normalize(s) {
  return (s || "").toLowerCase().trim();
}

function projectMatches(project, searchText, selectedTag) {
  const s = normalize(searchText);
  const tagOk = selectedTag === "all" || (project.tags || []).includes(selectedTag);
  if (!s) return tagOk;

  const haystack = normalize(
    `${project.title} ${project.description} ${(project.bullets || []).join(" ")} ${(project.tags || []).join(" ")}`
  );

  return tagOk && haystack.includes(s);
}

function buildProjectCard(project) {
  const card = document.createElement("div");
  card.className = "card project-card";

  /*const media = document.createElement("div");
  media.className = "project-media";

  const img = document.createElement("img");
  img.className = "project-img";
  img.src = project.image || "";
  img.alt = project.title;

  img.onerror = () => {
    img.style.display = "none";
    media.classList.add("no-image");
    media.innerHTML = `<div class="project-fallback">${project.title}</div>`;
  };

  media.appendChild(img);
  card.appendChild(media);*/

  const h3 = document.createElement("h3");
  h3.textContent = project.title;
  card.appendChild(h3);

  const p = document.createElement("p");
  p.className = "tagline";
  p.textContent = project.description;
  card.appendChild(p);

  if (Array.isArray(project.bullets) && project.bullets.length > 0) {
    const ul = document.createElement("ul");
    ul.className = "project-bullets";

    project.bullets.slice(0, 3).forEach((b) => {
      const li = document.createElement("li");
      li.textContent = b;
      ul.appendChild(li);
    });

    card.appendChild(ul);
  }

  const chips = document.createElement("div");
  chips.className = "chips";
  (project.tags || []).forEach((t) => {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.textContent = t;
    chips.appendChild(chip);
  });
  card.appendChild(chips);

  const actions = document.createElement("div");
  actions.className = "card-actions";

  const gh = document.createElement("a");
  gh.className = "small-btn primary";
  gh.textContent = "GitHub";

  if (project.github && project.github.trim().length > 0 && !project.github.includes("your-username")) {
    gh.href = project.github;
    gh.target = "_blank";
    gh.rel = "noreferrer";
  } else {
    gh.href = "#";
    gh.textContent = "GitHub (Add link)";
    gh.addEventListener("click", (e) => e.preventDefault());
  }

  actions.appendChild(gh);

  if (project.demo && project.demo.trim().length > 0) {
    const demo = document.createElement("a");
    demo.className = "small-btn";
    demo.href = project.demo;
    demo.target = "_blank";
    demo.rel = "noreferrer";
    demo.textContent = "Live Demo";
    actions.appendChild(demo);
  }

  card.appendChild(actions);
  return card;
}

function renderProjects(projects) {
  const grid = document.getElementById("projectsGrid");
  grid.innerHTML = "";

  if (projects.length === 0) {
    const empty = document.createElement("div");
    empty.className = "card";
    empty.innerHTML = "<h3>No projects found</h3><p>Try a different search or tag.</p>";
    grid.appendChild(empty);
    return;
  }

  projects.forEach(p => grid.appendChild(buildProjectCard(p)));
}

function setupFilters() {
  const tagSelect = document.getElementById("tagFilter");
  const searchInput = document.getElementById("projectSearch");

  const tags = getUniqueTags(PROJECTS);
  tags.forEach(t => {
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = t;
    tagSelect.appendChild(opt);
  });

  const apply = () => {
    const selectedTag = tagSelect.value;
    const searchText = searchInput.value;

    const filtered = PROJECTS.filter(p => projectMatches(p, searchText, selectedTag));
    renderProjects(filtered);
  };

  tagSelect.addEventListener("change", apply);
  searchInput.addEventListener("input", apply);

  apply();
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  const label = document.getElementById("themeBtnText");
  if (label) label.textContent = theme === "dark" ? "Dark" : "Light";
}

function setupTheme() {
  const saved = localStorage.getItem("theme");
  const theme = saved ? saved : "light";
  setTheme(theme);

  const btn = document.getElementById("themeBtn");
  btn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    setTheme(current === "dark" ? "light" : "dark");
  });
}

function setupMobileMenu() {
  const btn = document.getElementById("menuBtn");
  const nav = document.getElementById("nav");
  if (!btn || !nav) return;

  btn.addEventListener("click", () => {
    const isOpen = nav.style.display === "flex";
    nav.style.display = isOpen ? "none" : "flex";
    nav.style.flexDirection = "column";
    nav.style.gap = "12px";
    nav.style.position = "absolute";
    nav.style.right = "20px";
    nav.style.top = "64px";
    nav.style.padding = "14px";
    nav.style.background = "var(--panelSolid)";
    nav.style.border = "1px solid var(--border)";
    nav.style.borderRadius = "14px";
    nav.style.boxShadow = "var(--shadow)";
    nav.style.backdropFilter = "blur(12px)";
  });

  nav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      if (window.innerWidth <= 640) nav.style.display = "none";
    });
  });
}

function setupYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", () => {
  setupYear();
  setupTheme();
  setupMobileMenu();
  setupFilters();
});
