document
  .getElementById("discountForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    const shopper = {
      name: name,
      email: email,
    };

    document.getElementById("shopperDetails").textContent = JSON.stringify(
      shopper,
      null,
      2
    );
  });
