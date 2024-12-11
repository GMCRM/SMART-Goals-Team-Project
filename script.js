document.addEventListener("DOMContentLoaded", function () {
  const goalForm = document.getElementById("goalForm");
  const goalTitleInput = document.getElementById("goalTitle");
  const goalSpecificInput = document.getElementById("goalSpecific");
  const goalMeasurableInput = document.getElementById("goalMeasurable");
  const goalAchievableInput = document.getElementById("goalAchievable");
  const goalRelevantInput = document.getElementById("goalRelevant");
  const goalTimeBoundInput = document.getElementById("goalTimeBound");
  const goalList = document.getElementById("goalList");
  const submitBtn = document.getElementById("submit-btn");
  const cancelBtn = document.getElementById("cancel-btn");
  const toggleFormBtn = document.getElementById("toggle-form-btn");
  const goalFormSection = document.getElementById("goal-form-section");
  

  let smartGoals = JSON.parse(localStorage.getItem("smartGoals")) || [];
  let editingGoalId = null;

  function toggleForm() {
    goalFormSection.classList.toggle('visible');
    
    const svgPlus = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
      Add SMART Goal
    `;
    
    const svgClose = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
      Close Form
    `;

    toggleFormBtn.innerHTML = goalFormSection.classList.contains('visible') ? svgClose : svgPlus;
  }

  toggleFormBtn.addEventListener('click', toggleForm);

  function resetForm() {
    goalForm.reset();
    editingGoalId = null;
    submitBtn.textContent = "Add Goal";
    cancelBtn.style.display = "none";
    document.getElementById('form-title').textContent = "Add a New SMART Goal";
  }

  cancelBtn.addEventListener('click', () => {
    resetForm();
    toggleForm();
  });



  function renderGoals() {
    goalList.innerHTML = '';
    
    if (smartGoals.length === 0) {
      goalList.innerHTML = `
        <div class="card">
          <div class="empty-state">
            No goals yet. Add your first SMART goal!
          </div>
        </div>
      `;
      return;
    }

    smartGoals.forEach(goal => {
      const goalItem = document.createElement("div");
      goalItem.classList.add("goal-card", "card");
      goalItem.innerHTML = `
        <div class="goal-header" onclick="toggleGoalDetails(${goal.id})">
          <div>
            <div class="goal-title">${goal.title}</div>
            <div class="goal-time">⏰ ${getRemainingTime(goal.timeBound)}</div>
          </div>
          <div class="goal-actions">
            <button class="btn btn-edit" onclick="event.stopPropagation(); editGoal(${goal.id})">Edit</button>
            <button class="btn btn-danger" onclick="event.stopPropagation(); deleteGoal(${goal.id})">Delete</button>
          </div>
        </div>
        <div class="goal-details" id="goal-details-${goal.id}">
          <div class="goal-detail-item">
            <h4>Specific</h4>
            <p>${goal.specific}</p>
          </div>
          <div class="goal-detail-item">
            <h4>Measurable</h4>
            <p>${goal.measurable}</p>
          </div>
          <div class="goal-detail-item">
            <h4>Achievable</h4>
            <p>${goal.achievable}</p>
          </div>
          <div class="goal-detail-item">
            <h4>Relevant</h4>
            <p>${goal.relevant}</p>
          </div>
          <div class="goal-detail-item">
            <h4>Time-bound</h4>
            <p>${new Date(goal.timeBound).toLocaleString()}</p>
          </div>
        </div>
      `;
      goalList.appendChild(goalItem);
    });
  }

  function getRemainingTime(timebound) {
    const remaining = new Date(timebound) - new Date();
    if (remaining <= 0) return 'Expired';
    
    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${days}d ${hours}h ${minutes}m remaining`;
  }

  window.toggleGoalDetails = function(goalId) {
    const detailsElement = document.getElementById(`goal-details-${goalId}`);
    detailsElement.classList.toggle('active');
  }

  window.editGoal = function(goalId) {
    const goal = smartGoals.find(g => g.id === goalId);
    if (!goal) return;

    editingGoalId = goalId;
    goalTitleInput.value = goal.title;
    goalSpecificInput.value = goal.specific;
    goalMeasurableInput.value = goal.measurable;
    goalAchievableInput.value = goal.achievable;
    goalRelevantInput.value = goal.relevant;
    goalTimeBoundInput.value = goal.timeBound;

    submitBtn.textContent = "Update Goal";
    cancelBtn.style.display = "block";
    document.getElementById('form-title').textContent = "Edit SMART Goal";

    if (!goalFormSection.classList.contains('visible')) {
      toggleForm();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  window.deleteGoal = function(goalId) {
    if (confirm('Are you sure you want to delete this goal?')) {
      smartGoals = smartGoals.filter(goal => goal.id !== goalId);
      localStorage.setItem("smartGoals", JSON.stringify(smartGoals));
      renderGoals();
    }
  }

  goalForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const goalData = {
      id: editingGoalId || Date.now(),
      title: goalTitleInput.value.trim(),
      specific: goalSpecificInput.value.trim(),
      measurable: goalMeasurableInput.value.trim(),
      achievable: goalAchievableInput.value.trim(),
      relevant: goalRelevantInput.value.trim(),
      timeBound: goalTimeBoundInput.value
    };

    if (!goalData.title || !goalData.specific || !goalData.measurable || 
        !goalData.achievable || !goalData.relevant || !goalData.timeBound) {
      alert("Please fill in all fields.");
      return;
    }

    if (editingGoalId) {
      smartGoals = smartGoals.map(goal => 
        goal.id === editingGoalId ? goalData : goal
      );
    } else {
      smartGoals.push(goalData);
    }

    localStorage.setItem("smartGoals", JSON.stringify(smartGoals));
    renderGoals();
    resetForm();
    toggleForm();
  });

  startExpirationChecker();
  renderGoals();
});
