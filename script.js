const fruitForm = document.querySelector("#inputSection form");
const fruitList = document.querySelector("#fruitSection ul");
const fruitNutrition = document.querySelector("#nutritionSection p");
const createForm = document.querySelector("#create-form");

let cal = 0;
const fruitCal = {};
const apiKey = "32938820-5e61df361b127f361477e204b";

fruitForm.addEventListener("submit", extractFruit);
createForm.addEventListener("submit", createNewFruit);

function extractFruit(e) {
    e.preventDefault();
    fetchFruitData(e.target.fruitInput.value);
    e.target.fruitInput.value = "";
}

async function fetchFruitData(fruit) {
    try {
        //Make sure to replace this link with your deployed API URL in this fetch
        const respData = await fetch(`https://fruity-api-cxtw.onrender.com/fruits/${fruit}`);
        const respImg = await fetch(
            `https://pixabay.com/api/?q=${fruit}+fruit&key=${apiKey}`
        );

        if (respData.ok && respImg.ok) {
            const data = await respData.json();
            const imgData = await respImg.json();
            addFruit(data, imgData);
        } else {
            throw "Something has gone wrong with one of the API requests";
        }
    } catch (e) {
        console.log(e);
    }
}

async function createNewFruit(e) {
    e.preventDefault();

    const data = {name: e.target.fruitInput.value};

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }

    //Make sure to add your deployed API URL in this fetch
    const response = await fetch(`https://fruity-api-cxtw.onrender.com/fruits`, options);
    
    let messageStatus = document.querySelector("#message")

    if(response.status === 201) {
        e.target.fruitInput.value = ''
        messageStatus.textContent = "Fruit successfully created."
        setTimeout(() => {
          messageStatus.textContent = ""
        }, 4000)
    } else {
        e.target.fruitInput.value = ''
        messageStatus.textContent = "This fruit already exists. Please enter another fruit!"
        setTimeout(() => {
          messageStatus.textContent = ""
        }, 4000)
    }
}

function addFruit(fruit, fruitImg) {
    const img = document.createElement("img");
    img.classList.add('fruits');
    img.alt = fruit.name;
    img.src = fruitImg.hits[0].previewURL;

    img.addEventListener("click", removeFruit, { once: true });
    fruitList.appendChild(img);

    fruitCal[fruit.name] = fruit.nutritions.calories;

    cal += fruit.nutritions.calories;
    fruitNutrition.textContent = "Total Calories: " + cal;
}

function removeFruit(e) {
    const fruitName = e.target.alt;
    cal -= fruitCal[fruitName];
    fruitNutrition.textContent = "Total Calories: " + cal;

    delete fruitCal[fruitName];
    e.target.remove();
}
