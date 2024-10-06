mapboxgl.accessToken =
  "pk.eyJ1Ijoic2hpZmEzMyIsImEiOiJjbTFjMDJzMmoyNWRvMnZzOGZzcXo3cHQ1In0.CLdUXxSpEVQV7OR2dhz6qw";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [-122.4194, 37.7749],
  zoom: 10,
});

document.getElementById("searchButton").addEventListener("click", function () {
  const location = document.getElementById("search").value;

  fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      location
    )}.json?access_token=${mapboxgl.accessToken}`
  )
    .then((response) => response.json())
    .then((data) => {
      const coordinates = data.features[0].geometry.coordinates;
      map.flyTo({ center: coordinates, zoom: 14 });
    })
    .catch((error) => console.error("Error fetching location:", error));
});

document.getElementById("findNearby").addEventListener("click", function () {
  const location = document.getElementById("search").value;

  fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      location
    )}.json?access_token=${mapboxgl.accessToken}`
  )
    .then((response) => response.json())
    .then((data) => {
      const coordinates = data.features[0].geometry.coordinates;
      const category = document.getElementById("filterCategory").value;
      const radius = 500;
      const type = category ? `&type=${category}` : "";

      fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates[0]},${coordinates[1]}.json?access_token=${mapboxgl.accessToken}${type}`
      )
        .then((response) => response.json())
        .then((data) => {
          const resultsDiv = document.getElementById("results");
          resultsDiv.innerHTML = "";
          data.features.forEach((feature) => {
            const resultItem = document.createElement("div");
            resultItem.textContent = feature.place_name;
            resultsDiv.appendChild(resultItem);
          });
        })
        .catch((error) =>
          console.error("Error fetching nearby places:", error)
        );
    })
    .catch((error) => console.error("Error fetching location:", error));
});

document
  .getElementById("calculateTwoLocations")
  .addEventListener("click", function () {
    const firstLocation = document.getElementById("search").value;
    const secondLocation = document.getElementById("secondLocation").value;

    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        firstLocation
      )}.json?access_token=${mapboxgl.accessToken}`
    )
      .then((response) => response.json())
      .then((data) => {
        const firstCoords = data.features[0].geometry.coordinates;

        fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            secondLocation
          )}.json?access_token=${mapboxgl.accessToken}`
        )
          .then((response) => response.json())
          .then((data) => {
            const secondCoords = data.features[0].geometry.coordinates;

            fetch(
              `https://api.mapbox.com/directions/v5/mapbox/driving/${firstCoords[0]},${firstCoords[1]};${secondCoords[0]},${secondCoords[1]}?access_token=${mapboxgl.accessToken}`
            )
              .then((response) => response.json())
              .then((data) => {
                const distance = data.routes[0].distance;
                const distanceText = `Distance between ${firstLocation} and ${secondLocation} is ${Math.round(
                  distance / 1000
                )} km.`;
                const resultsDiv = document.getElementById("results");
                resultsDiv.innerHTML = distanceText;
              })
              .catch((error) =>
                console.error("Error fetching distance:", error)
              );
          })
          .catch((error) =>
            console.error("Error fetching second location:", error)
          );
      })
      .catch((error) => console.error("Error fetching first location:", error));
  });

document.getElementById("getRoute").addEventListener("click", function () {
  const firstLocation = document.getElementById("search").value;
  const secondLocation = document.getElementById("secondLocation").value;
  const travelMode = document.getElementById("filterCategory").value;

  fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      firstLocation
    )}.json?access_token=${mapboxgl.accessToken}`
  )
    .then((response) => response.json())
    .then((data) => {
      const firstCoords = data.features[0].geometry.coordinates;

      fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          secondLocation
        )}.json?access_token=${mapboxgl.accessToken}`
      )
        .then((response) => response.json())
        .then((data) => {
          const secondCoords = data.features[0].geometry.coordinates;

          fetch(
            `https://api.mapbox.com/directions/v5/mapbox/${travelMode}/${firstCoords[0]},${firstCoords[1]};${secondCoords[0]},${secondCoords[1]}?access_token=${mapboxgl.accessToken}`
          )
            .then((response) => response.json())
            .then((data) => {
              const duration = data.routes[0].duration;
              const hours = Math.floor(duration / 3600);
              const minutes = Math.floor((duration % 3600) / 60);
              const travelTimeText = `Estimated travel time between ${firstLocation} and ${secondLocation} is ${hours} hours and ${minutes} minutes.`;
              const resultsDiv = document.getElementById("results");
              resultsDiv.innerHTML = travelTimeText;
            })
            .catch((error) =>
              console.error("Error fetching travel time:", error)
            );
        })
        .catch((error) =>
          console.error("Error fetching second location:", error)
        );
    })
    .catch((error) => console.error("Error fetching first location:", error));
});
