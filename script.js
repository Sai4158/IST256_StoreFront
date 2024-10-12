document
  .getElementById("discountForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const age = document.getElementById("age").value;
    const address = document.getElementById("address").value;

    const shopper = {
      name: name,
      email: email,
      phone: phone,
      age: age,
      address: address,
    };

    document.getElementById("shopperDetails").textContent = JSON.stringify(
      shopper,
      null,
      2
    );
  });
