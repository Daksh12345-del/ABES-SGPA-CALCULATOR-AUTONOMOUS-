const subjectsContainer = document.getElementById("subjectsContainer");
const groupSelect = document.getElementById("groupSelect");

/* ===== SUBJECT DATA ===== */

const semester1 = {
  A: [
    { code: "25AS101", name: "Applied Physics", credits: 3 },
    { code: "25EL101", name: "Basics of Electrical Engineering", credits: 3 },
    { code: "25AS102", name: "Linear Algebra & Statistics", credits: 3 },
    { code: "25CS101", name: "Programming in C++", credits: 3 },
    { code: "25AS103", name: "Environment & Sustainability", credits: 2 },
    { code: "25AI101", name: "Essentials of AI", credits: 2 },
    { code: "25AS151", name: "Physics Lab", credits: 1 },
    { code: "25CS151", name: "Programming Lab", credits: 1 },
    { code: "25EL151", name: "Electrical Lab", credits: 1 },
    { code: "25WD151", name: "Web Designing Workshop", credits: 2 },
    { code: "25HS151", name: "Holistic Skill & Innovation", credits: 1 }
  ],
  B: [
    { code: "25ME101", name: "Mechanical & Automation Engg", credits: 3 },
    { code: "25EC101", name: "Electronics Engineering", credits: 3 },
    { code: "25AS102", name: "Linear Algebra & Statistics", credits: 3 },
    { code: "25CS101", name: "Programming in C++", credits: 3 },
    { code: "25HU101", name: "Soft Skills", credits: 2 },
    { code: "25HU102", name: "Design Thinking & Innovation", credits: 2 },
    { code: "25HU151", name: "Communication Lab", credits: 1 },
    { code: "25CS151", name: "Programming Lab", credits: 1 },
    { code: "25ME151", name: "Digital Manufacturing Lab", credits: 1 },
    { code: "25WD151", name: "Web Designing Workshop", credits: 2 },
    { code: "25EC151", name: "Electronics Workshop", credits: 1 }
  ]
};

groupSelect.addEventListener("change", renderSubjects);

function renderSubjects() {
  subjectsContainer.innerHTML = "";
  const subjects = semester1[groupSelect.value];

  subjects.forEach((subject, index) => {
    const div = document.createElement("div");
    div.classList.add("subject");

    div.innerHTML = `
      <h4>${subject.code}</h4>
      <p>${subject.name}</p>
      <small>Credits: ${subject.credits}</small>
      <input type="number" min="0" max="100" id="marks-${index}" placeholder="Enter Marks">
    `;

    subjectsContainer.appendChild(div);
    document.getElementById(`marks-${index}`)
      .addEventListener("input", calculateSGPA);
  });
}

function getGradePoint(marks) {
  if (marks >= 90) return 10;
  if (marks >= 80) return 9;
  if (marks >= 70) return 8;
  if (marks >= 60) return 7;
  if (marks >= 50) return 6;
  if (marks >= 40) return 5;
  return 0;
}

function calculateSGPA() {
  const subjects = semester1[groupSelect.value];
  let totalCredits = 0;
  let weightedSum = 0;

  subjects.forEach((subject, index) => {
    const marks = parseFloat(document.getElementById(`marks-${index}`).value) || 0;
    const gradePoint = getGradePoint(marks);

    weightedSum += gradePoint * subject.credits;
    totalCredits += subject.credits;
  });

  const sgpa = weightedSum / totalCredits || 0;

  document.getElementById("sgpaText").innerText = sgpa.toFixed(2);
  updateCircle(sgpa);
}

renderSubjects();
updateCircle(0);

/* ===== GRAPH + CGPA ===== */

const ctx = document.getElementById("progressChart").getContext("2d");

let semesterLabels = [];
let sgpaData = [];

const progressChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: semesterLabels,
    datasets: [{
      label: "SGPA Trend",
      data: sgpaData,
      borderColor: "#38bdf8",
      borderWidth: 3,
      tension: 0.4,
      fill: false
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: false
      }
    }
  }
});

/* ===== SMART AUTO ZOOM ===== */

function updateYAxis() {
  if (sgpaData.length === 0) return;

  const minValue = Math.min(...sgpaData);
  const maxValue = Math.max(...sgpaData);
  const padding = 0.5;

  progressChart.options.scales.y.min = Math.max(0, minValue - padding);
  progressChart.options.scales.y.max = Math.min(10, maxValue + padding);
}

/* ===== ADD SEMESTER ===== */

document.getElementById("addSemesterBtn").addEventListener("click", () => {
  const input = document.getElementById("sgpaInput");
  const value = parseFloat(input.value);

  if (isNaN(value) || value < 0 || value > 10) {
    alert("Enter valid SGPA between 0 and 10");
    return;
  }

  semesterLabels.push("Sem " + (semesterLabels.length + 1));
  sgpaData.push(value);

  updateYAxis();
  progressChart.update();
  updateOverallCGPA();

  input.value = "";
});

/* ===== OVERALL CGPA ===== */

document.getElementById("addOverallBtn").addEventListener("click", () => {
  const input = document.getElementById("overallInput");
  const value = parseFloat(input.value);

  if (isNaN(value) || value < 0 || value > 10) {
    alert("Enter valid SGPA between 0 and 10");
    return;
  }

  semesterLabels.push("Sem " + (semesterLabels.length + 1));
  sgpaData.push(value);

  updateYAxis();
  progressChart.update();
  updateOverallCGPA();

  input.value = "";
});

function updateOverallCGPA() {
  if (sgpaData.length === 0) {
    document.getElementById("averageCGPA").innerText = "0.00";
    document.getElementById("graphAverage").innerText = "0.00";
    return;
  }

  const sum = sgpaData.reduce((a, b) => a + b, 0);
  const avg = sum / sgpaData.length;

  document.getElementById("semesterList").innerText =
    "Semesters: " + sgpaData.join(" , ");

  document.getElementById("averageCGPA").innerText = avg.toFixed(2);
  document.getElementById("graphAverage").innerText = avg.toFixed(2);
}

/* ===== THEME TOGGLE ===== */

const toggleBtn = document.getElementById("themeToggle");

if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light-mode");
  toggleBtn.innerText = "☀️";
}

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");

  if (document.body.classList.contains("light-mode")) {
    toggleBtn.innerText = "☀️";
    localStorage.setItem("theme", "light");
  } else {
    toggleBtn.innerText = "🌙";
    localStorage.setItem("theme", "dark");
  }
});

/* ===== CIRCLE PROGRESS ===== */

function updateCircle(sgpa) {
  const circle = document.querySelector(".circle-progress");

  const radius = 80;
  const circumference = 2 * Math.PI * radius;

  circle.style.strokeDasharray = circumference;
  circle.style.strokeDashoffset = circumference; // reset first

  const offset = circumference - (sgpa / 10) * circumference;

  circle.style.strokeDashoffset = offset;
}
/* ===== FEEDBACK TOGGLE ===== */

document.addEventListener("DOMContentLoaded", function () {
  const feedbackBtn = document.getElementById("feedbackToggle");
  const feedbackSection = document.getElementById("feedbackSection");

  feedbackBtn.addEventListener("click", function () {
    feedbackSection.classList.toggle("show-feedback");
  });
});
document.getElementById("exportPdfBtn").addEventListener("click", async function () {

  const reportContainer = document.getElementById("reportContainer");
  const reportSubjects = document.getElementById("reportSubjects");

  reportSubjects.innerHTML = "";

  // Add subjects with marks
  const subjects = semester1[groupSelect.value];

  subjects.forEach((subject, index) => {
    const marks = document.getElementById(`marks-${index}`).value || "0";

    const div = document.createElement("div");
    div.innerHTML = `
      <p><strong>${subject.code}</strong> - ${subject.name}
      | Marks: ${marks} | Credits: ${subject.credits}</p>
    `;
    reportSubjects.appendChild(div);
  });

  // Add SGPA and Average
  document.getElementById("reportSgpa").innerText =
    document.getElementById("sgpaText").innerText;

  document.getElementById("reportAvg").innerText =
    document.getElementById("graphAverage").innerText;

  // Convert Chart to image
  const chartCanvas = document.getElementById("progressChart");
  const chartImage = chartCanvas.toDataURL("image/png");
  document.getElementById("reportChartImg").src = chartImage;

  reportContainer.style.display = "block";

  const canvas = await html2canvas(reportContainer, { scale: 2 });

  const imgData = canvas.toDataURL("image/png");

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "mm", "a4");

  const imgWidth = 190;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
  pdf.save("ABES_CGPA_Report.pdf");

  reportContainer.style.display = "none";
});