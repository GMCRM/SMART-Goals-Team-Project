document.addEventListener("DOMContentLoaded", function () {
  const goalForm = document.getElementById("goalForm");
  const goalTitleInput = document.getElementById("goalTitle");
  const goalSpecificInput = document.getElementById("goalSpecific");
  const goalMeasurableInput = document.getElementById("goalMeasurable");
  const goalAchievableInput = document.getElementById("goalAchievable");
  const goalRelevantInput = document.getElementById("goalRelevant");
  const goalTimeBoundInput = document.getElementById("goalTimeBound");
  const goalList = document.getElementById("goalList");
  const notificationContainer = document.getElementById("notificationContainer");

  let smartGoals = JSON.parse(localStorage.getItem("smartGoals")) || [];
  smartGoals.forEach(displayGoal);

  goalTitleInput.focus();

  goalForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const goalTitle = goalTitleInput.value.trim();
    const goalSpecific = goalSpecificInput.value.trim();
    const goalMeasurable = goalMeasurableInput.value.trim();
    const goalAchievable = goalAchievableInput.value.trim();
    const goalRelevant = goalRelevantInput.value.trim();
    const goalTimeBound = goalTimeBoundInput.value;

    if (!goalTitle || !goalSpecific || !goalMeasurable || !goalAchievable || !goalRelevant || !goalTimeBound) {
      showNotification("Error: Please fill in all fields.", "error");
      return;
    }

    if (smartGoals.some((goal) => goal.title === goalTitle)) {
      showNotification("Error: A goal with this title already exists.", "error");
      return;
    }

    const newGoal = {
      id: Date.now(),
      title: goalTitle,
      specific: goalSpecific,
      measurable: goalMeasurable,
      achievable: goalAchievable,
      relevant: goalRelevant,
      timeBound: goalTimeBound,
    };

    smartGoals.push(newGoal);
    localStorage.setItem("smartGoals", JSON.stringify(smartGoals));
    displayGoal(newGoal);

    showNotification("SMART Goal Saved!", "success");
    goalForm.reset();
    goalTitleInput.focus();
  });

  function displayGoal(goal) {
    const goalItem = document.createElement("div");
    goalItem.classList.add("goal-item");

    goalItem.innerHTML = `
      <div class="goal-header">
        <div class="goal-title">${goal.title}</div>
        <div class="arrow"></div>
      </div>
      <div class="goal-details">
        <div><strong>Specific:</strong> ${goal.specific}</div>
        <div><strong>Measurable:</strong> ${goal.measurable}</div>
        <div><strong>Achievable:</strong> ${goal.achievable}</div>
        <div><strong>Relevant:</strong> ${goal.relevant}</div>
        <div><strong>Time-Bound:</strong> ${goal.timeBound}</div>
        <div class="goal-actions">
          <button class="delete-button" data-id="${goal.id}">Delete</button>
        </div>
      </div>
    `;

    goalList.appendChild(goalItem);

    const headerElement = goalItem.querySelector(".goal-header");
    const detailsElement = goalItem.querySelector(".goal-details");
    headerElement.addEventListener("click", () => {
      detailsElement.classList.toggle("visible");
      headerElement.classList.toggle("expanded");
    });

    const deleteButton = goalItem.querySelector(".delete-button");
    deleteButton.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteGoal(goal.id, goalItem);
    });

    const timerElement = document.createElement("div");
    timerElement.classList.add("timer");
    detailsElement.appendChild(timerElement);
    timer(goal.timeBound, timerElement, goal.id);
  }

  function deleteGoal(id, goalElement) {
    smartGoals = smartGoals.filter((goal) => goal.id !== id);
    localStorage.setItem("smartGoals", JSON.stringify(smartGoals));
    goalElement.remove();
    showNotification("SMART Goal Deleted!", "success");
  }

  function timer(endTime, timerElement, goalId) {
    const second = 1000,
      minute = second * 60,
      hour = minute * 60,
      day = hour * 24;

    let end = new Date(endTime).getTime();
    let x = setInterval(() => {
      let now = new Date().getTime();
      let timeLeft = end - now;

      if (timeLeft < 0) {
        timerElement.innerHTML = "Time's up!";
        clearInterval(x);
        deleteGoal(goalId, timerElement.closest(".goal-item"));
        return;
      }

      let days = Math.floor(timeLeft / day),
        hours = Math.floor((timeLeft % day) / hour),
        minutes = Math.floor((timeLeft % hour) / minute),
        seconds = Math.floor((timeLeft % minute) / second);

      timerElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }, 1000);
  }

  function showNotification(message, type) {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;

    notificationContainer.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
});
