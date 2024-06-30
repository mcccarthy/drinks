const apiUrl = 'https://www.thecocktaildb.com/api/json/v1/1';

document.addEventListener('DOMContentLoaded', () => {
  const boozeSelect = document.getElementById('booze-select');
  const drinkImagesContainer = document.getElementById('drink-images');
  const drinkDetailsContainer = document.getElementById('drink-details');

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

  // Function to fetch and display drinks based on selected category
  function fetchAndDisplayDrinks(category) {
    let url;
    if (category === 'all') {
      url = `${apiUrl}/search.php?s=`;
    } else {
      url = `${apiUrl}/filter.php?c=${category}`;
    }
    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log('Fetched drinks:', data);
        if (data.drinks) {
          displayDrinkImages(data.drinks);
        } else {
          console.error(`No drinks found for category: ${category}`);
          drinkImagesContainer.innerHTML = ''; // Clear images container
          drinkDetailsContainer.innerHTML = ''; // Clear details container
        }
      })
      .catch(error => console.error(`Error fetching drinks for ${category}:`, error));
  }

  // Function to display drink images in a grid
  function displayDrinkImages(drinks) {
    drinkImagesContainer.innerHTML = ''; // Clear previous images
    drinkDetailsContainer.innerHTML = ''; // Clear previous details

    drinks.forEach(drink => {
      const drinkCard = document.createElement('div');
      drinkCard.classList.add('drink-card');

      const drinkImage = document.createElement('img');
      drinkImage.src = drink.strDrinkThumb;
      drinkImage.alt = drink.strDrink;
      drinkImage.title = drink.strDrink;
      drinkImage.addEventListener('click', () => displayDrinkDetails(drink));

      const drinkTitle = document.createElement('h3');
      drinkTitle.textContent = drink.strDrink;

      drinkCard.appendChild(drinkImage);
      drinkCard.appendChild(drinkTitle);
      drinkImagesContainer.appendChild(drinkCard);
    });

    drinkImagesContainer.style.display = 'grid'; // Show images in a grid layout
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
      const instructions = document.createElement('p');
      instructions.textContent = `Instructions: ${drink.strInstructions}`;
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

    drinkDetailsContainer.style.display = 'block'; // Show drink details
    drinkDetailsContainer.scrollIntoView({ behavior: 'smooth' }); // Scroll to drink details
  }

  // Event listener for booze select change
  boozeSelect.addEventListener('change', () => {
    const selectedBooze = boozeSelect.value;
    console.log('Selected booze:', selectedBooze);
    if (selectedBooze !== 'default') {
      fetchAndDisplayDrinks(selectedBooze); // Pass the category in its original case
    } else {
      fetchAndDisplayDrinks(''); // Fetch all drinks if default option selected
    }
  });

  // Initialize the page
  populateBoozeSelect();
});
