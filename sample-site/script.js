document.addEventListener("DOMContentLoaded", () => {
  // RISK FACTOR INFO
  const factorInfo = {
    "Occupied structure proximity": {
      text: "This is the single heaviest factor because it is the one that kills people. Methane migrating underground can collect in a basement or crawlspace until it reaches an ignition source.",
      notes: [
        "Worth the full 30 points inside 150 feet",
        "DEP treats gas in an occupied building as an emergency, not a scheduled job",
        "Distance is re-measured server side against real building footprints"
      ]
    },
    "Surface methane concentration": {
      text: "A reading at the wellhead tells you whether the wellbore is actively venting or has sealed itself with debris over the decades.",
      notes: [
        "Above 5,000 ppm counts as severe venting",
        "Audible hissing usually means a reading high enough to matter",
        "Bubbling in standing water beside the pipe is the same signal"
      ]
    },
    "Water resource proximity": {
      text: "Old wellbores move brine and hydrocarbons into groundwater long before anyone notices a problem at the surface.",
      notes: [
        "Brine from these formations is saltier than seawater",
        "Contamination usually reaches a stream before a monitoring point",
        "Measured against the National Hydrography Dataset in production"
      ]
    },
    "Age and record quality": {
      text: "A well drilled before 1900 has no construction record, so nobody knows what is in the hole or how deep it goes.",
      notes: [
        "Pre-1900 completions score the full 12 points",
        "Early wells were often abandoned with wood, rags or nothing at all",
        "Registration was not required in Pennsylvania until 1984"
      ]
    },
    "Sensitive site within 1,500 ft": {
      text: "Schools, daycares and hospitals concentrate people who cannot evacuate themselves quickly, which changes the consequence of the same leak.",
      notes: [
        "Binary factor: the site is either inside the radius or it is not",
        "Checked against NCES school locations",
        "Adds 10 points on top of the structure proximity score"
      ]
    },
    "Wellbore physical condition": {
      text: "The state of the pipe tells you how fast the well is deteriorating and how hard it will be to plug once a crew arrives.",
      notes: [
        "An open hole is also a physical fall hazard",
        "Rusted casing means the annulus is likely already compromised",
        "A sound cap does not mean the well is plugged"
      ]
    }
  };

  const cards = document.querySelectorAll(".card");
  const factorDetails = document.getElementById("factor-details");
  const factorTitle = document.getElementById("factor-title");
  const factorText = document.getElementById("factor-text");
  const factorNotes = document.getElementById("factor-notes");

  cards.forEach(card => {
    card.querySelector(".more-btn").addEventListener("click", () => {
      const factor = card.dataset.factor;
      const info = factorInfo[factor];

      factorTitle.textContent = factor;
      factorText.textContent = info.text;
      factorNotes.innerHTML = "";
      info.notes.forEach(n => {
        const li = document.createElement("li");
        li.textContent = n;
        factorNotes.appendChild(li);
      });

      factorDetails.classList.remove("hidden");
      factorDetails.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });

  // FIELD CHECK LOGIC
  const checkForm = document.getElementById("check-form");
  const checkResult = document.getElementById("check-result");
  const scoreValue = document.getElementById("score-value");
  const resultTier = document.getElementById("result-tier");
  const resultText = document.getElementById("result-text");
  const resetBtn = document.getElementById("reset-check");
  const pathText = document.getElementById("path-text");

  const tierAdvice = {
    Critical: "Report this today. A score this high usually means gas near a building, and DEP treats that as an emergency response trigger rather than a routine plugging job. If you can smell gas inside a structure, call 911 first.",
    High: "Report this week. Wells in this band are the ones that move to the front of a plugging queue once they are located, because the hazard is real but not immediate.",
    Moderate: "Worth reporting. It probably will not be plugged soon, but an unlocated well cannot be scheduled at all, and your report is what puts it on the map.",
    Low: "Still worth reporting. Low-scoring wells are the bulk of the inventory, and recording one costs you five minutes and improves the state's picture of where the holes are."
  };

  function tierFor(score) {
    if (score >= 70) return "Critical";
    if (score >= 50) return "High";
    if (score >= 30) return "Moderate";
    return "Low";
  }

  checkForm.addEventListener("submit", e => {
    e.preventDefault();

    const formData = new FormData(checkForm);
    const answered = new Set([...formData.keys()]).size;
    const totalQuestions = 4;

    if (answered < totalQuestions) {
      alert("Please answer all four questions before scoring.");
      return;
    }

    let score = 0;
    for (const value of formData.values()) {
      score += Number(value);
    }
    if (score > 100) score = 100;

    const tier = tierFor(score);

    scoreValue.textContent = score;
    scoreValue.className = "tier-" + tier;
    resultTier.textContent = tier + " risk";
    resultTier.className = "tier-" + tier;
    resultText.textContent = tierAdvice[tier];

    checkResult.classList.remove("hidden");
    checkResult.scrollIntoView({ behavior: "smooth", block: "center" });

    pathText.textContent =
      "You scored " + score + " out of 100, which is " + tier.toLowerCase() +
      " risk. " + tierAdvice[tier];
  });

  resetBtn.addEventListener("click", () => {
    checkForm.reset();
    checkResult.classList.add("hidden");
    pathText.textContent = "Run the field check above to see what to do next.";
  });

  // FADE-IN ON SCROLL
  const faders = document.querySelectorAll(".fade-in");

  const appearOnScroll = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          appearOnScroll.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1
    }
  );

  faders.forEach(fader => {
    appearOnScroll.observe(fader);
  });
});
