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
  
    // Retrieve and display SMART goals from localStorage on page load
    let smartGoals = JSON.parse(localStorage.getItem("smartGoals")) || [];
    smartGoals.forEach(displayGoal);
  
    // Automatically focus on the title input field on load
    goalTitleInput.focus();
  
    // Form submission handler
    goalForm.addEventListener("submit", function (event) {
      event.preventDefault();
  
      const goalTitle = goalTitleInput.value.trim();
      const goalSpecific = goalSpecificInput.value.trim();
      const goalMeasurable = goalMeasurableInput.value.trim();
      const goalAchievable = goalAchievableInput.value.trim();
      const goalRelevant = goalRelevantInput.value.trim();
      const goalTimeBound = goalTimeBoundInput.value;
  
      // Validation: Check for empty input
      if (!goalTitle || !goalSpecific || !goalMeasurable || !goalAchievable || !goalRelevant || !goalTimeBound) {
        showNotification("Error: Please fill in all fields.", "error");
        return;
      }
  
      // Prevent duplicate titles
      if (smartGoals.some((goal) => goal.title === goalTitle)) {
        showNotification("Error: A goal with this title already exists.", "error");
        return;
      }
  
      // Create new SMART goal object
      const newGoal = {
        id: Date.now(), // Assign unique ID
        title: goalTitle,
        specific: goalSpecific,
        measurable: goalMeasurable,
        achievable: goalAchievable,
        relevant: goalRelevant,
        timeBound: goalTimeBound,
      };
  
      // Add goal to local storage and update UI
      smartGoals.push(newGoal);
      localStorage.setItem("smartGoals", JSON.stringify(smartGoals));
      displayGoal(newGoal);
  
      // Show success notification
      showNotification("SMART Goal Saved!", "success");
  
      // Clear the form
      goalForm.reset();
      goalTitleInput.focus();
    });
  
    // Function to display a SMART goal in the UI
    function displayGoal(goal) {
      const goalItem = document.createElement("div");
      goalItem.classList.add("goal-item");
  
      goalItem.innerHTML = `
        <div class="goal-title">${goal.title}</div>
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
  
      // Add functionality to toggle details
      const titleElement = goalItem.querySelector(".goal-title");
      const detailsElement = goalItem.querySelector(".goal-details");
      titleElement.addEventListener("click", () => {
        detailsElement.classList.toggle("visible");
      });
  
      // Add delete functionality to the button
      const deleteButton = goalItem.querySelector(".delete-button");
      deleteButton.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent toggling details on delete click
        deleteGoal(goal.id, goalItem);
      });
    }
  
    // Function to delete a SMART goal
    function deleteGoal(id, goalElement) {
      // Remove from local storage
      smartGoals = smartGoals.filter((goal) => goal.id !== id);
      localStorage.setItem("smartGoals", JSON.stringify(smartGoals));
  
      // Remove from UI
      goalElement.remove();
  
      // Show success notification
      showNotification("SMART Goal Deleted!", "success");
    }
  
    // Function to display notifications
    function showNotification(message, type) {
      const notification = document.createElement("div");
      notification.className = `notification ${type}`;
      notification.textContent = message;
  
      notificationContainer.appendChild(notification);
  
      // Remove notification after 3 seconds
      setTimeout(() => {
        notification.remove();
      }, 3000);
    }
  });
  