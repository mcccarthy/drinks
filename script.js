const apiUrl = 'https://www.thecocktaildb.com/api/json/v1/1';

document.addEventListener('DOMContentLoaded', () => {
  const boozeSelect = document.getElementById('booze-select');
  const drinkCardsContainer = document.getElementById('drink-cards');
  const drinkDetailsContainer = document.getElementById('drink-details');
  const themeSwitch = document.getElementById('theme-switch');
  const scrollUpBtn = document.getElementById('scroll-up');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  let drinksData = [];
  let currentIndex = 0;

  // Function to populate dropdown with booze categories
  function populateBoozeSelect() {
    fetch(`${apiUrl}/list.php?c=list`)
      .then(response => response.json())
      .then(data => {
        boozeSelect.innerHTML = ''; // Clear existing options
        const defaultOption = document.createElement('option');
        defaultOption.textContent = 'Choose booze type';
        defaultOption.value = 'default';
        boozeSelect.appendChild(defaultOption);

        data.drinks.forEach(category => {
          const option = document.createElement('option');
          option.textContent = category.strCategory;
          option.value = category.strCategory; // Keep the original case
          boozeSelect.appendChild(option);
        });
      })
      .catch(error => console.error('Error fetching booze categories:', error));
  }

  // Function to fetch drinks based on selected category
  function fetchDrinks(category) {
    let url;
    if (category === 'default') {
      return; // Do nothing if default option selected
    } else if (category === 'all') {
      url = `${apiUrl}/search.php?s=`;
    } else {
      url = `${apiUrl}/filter.php?c=${category}`;
    }
    return fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log('Fetched drinks:', data);
        drinksData = data.drinks || [];
        displayDrinkCards(drinksData);
        resetCurrentIndex();
        updatePrevNextBtns();
      })
      .catch(error => {
        console.error(`Error fetching drinks for ${category}:`, error);
        drinksData = [];
        displayDrinkCards(drinksData);
        resetCurrentIndex();
        updatePrevNextBtns();
      });
  }

  // Function to reset current index when changing categories
  function resetCurrentIndex() {
    currentIndex = 0;
  }

  // Function to display drink cards
  function displayDrinkCards(drinks) {
    drinkCardsContainer.innerHTML = ''; // Clear previous cards
    drinkDetailsContainer.innerHTML = ''; // Clear previous details

    drinks.forEach((drink, index) => {
      const drinkCard = document.createElement('div');
      drinkCard.classList.add('drink-card');

      const drinkImage = document.createElement('img');
      drinkImage.src = drink.strDrinkThumb;
      drinkImage.alt = drink.strDrink;

      const drinkTitle = document.createElement('h3');
      drinkTitle.textContent = drink.strDrink;

      drinkCard.appendChild(drinkImage);
      drinkCard.appendChild(drinkTitle);
      drinkCardsContainer.appendChild(drinkCard);

      drinkCard.addEventListener('click', () => {
        fetchDrinkDetails(drink.idDrink);
        currentIndex = index;
        updatePrevNextBtns();
      });
    });
  }

  // Function to fetch drink details
  function fetchDrinkDetails(drinkId) {
    fetch(`${apiUrl}/lookup.php?i=${drinkId}`)
      .then(response => response.json())
      .then(data => {
        console.log('Fetched drink details:', data);
        displayDrinkDetails(data.drinks[0]);
      })
      .catch(error => console.error('Error fetching drink details:', error));
  }

  // Function to display drink details
  function displayDrinkDetails(drink) {
    drinkDetailsContainer.innerHTML = ''; // Clear previous details

    const title = document.createElement('h2');
    title.textContent = drink.strDrink;
    drinkDetailsContainer.appendChild(title);

    if (drink.strCategory) {
      const category = document.createElement('p');
      category.textContent = `Category: ${drink.strCategory}`;
      drinkDetailsContainer.appendChild(category);
    }

    if (drink.strInstructions) {
      const instructionsTitle = document.createElement('h3');
      instructionsTitle.textContent = 'Instructions:';
      drinkDetailsContainer.appendChild(instructionsTitle);

      const instructions = document.createElement('p');
      instructions.textContent = drink.strInstructions;
      drinkDetailsContainer.appendChild(instructions);
    }

    const ingredientsTitle = document.createElement('h3');
    ingredientsTitle.textContent = 'Ingredients:';
    drinkDetailsContainer.appendChild(ingredientsTitle);

    const ingredientsList = document.createElement('ul');
    for (let i = 1; i <= 15; i++) { // Assuming up to 15 ingredients
      const ingredient = drink[`strIngredient${i}`];
      const measure = drink[`strMeasure${i}`];
      if (ingredient && ingredient.trim() !== '') {
        const listItem = document.createElement('li');
        listItem.textContent = `${ingredient} - ${measure || 'Measure not available'}`;
        ingredientsList.appendChild(listItem);
      } else {
        break;
      }
    }
    drinkDetailsContainer.appendChild(ingredientsList);

    const drinkImage = document.createElement('img');
    drinkImage.src = drink.strDrinkThumb;
    drinkImage.alt = drink.strDrink;
    drinkDetailsContainer.appendChild(drinkImage);

    drinkDetailsContainer.classList.add('active'); // Show drink details
    drinkDetailsContainer.scrollIntoView({ behavior: 'smooth' }); // Scroll to drink details
  }

  // Function to update previous and next buttons visibility
  function updatePrevNextBtns() {
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === drinksData.length - 1;
  }

  // Function to handle previous button click
  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      fetchDrinkDetails(drinksData[currentIndex].idDrink);
      updatePrevNextBtns();
    }
  });

  // Function to handle next button click
  nextBtn.addEventListener('click', () => {
    if (currentIndex < drinksData.length - 1) {
      currentIndex++;
      fetchDrinkDetails(drinksData[currentIndex].idDrink);
      updatePrevNextBtns();
    }
  });

  // Function to handle theme switch
  themeSwitch.addEventListener('change', () => {
    document.body.classList.toggle('dark-theme');
  });

  // Function to handle scroll back to top
  scrollUpBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Event listener for booze select change
  boozeSelect.addEventListener('change', () => {
    const selectedBooze = boozeSelect.value;
    console.log('Selected booze:', selectedBooze);
    fetchDrinks(selectedBooze); // Pass the category in its original case
  });

  // Initialize the page
  populateBoozeSelect();
});
