document.querySelectorAll('.price').forEach(node => {
    node.textContent = new Intl.NumberFormat('ru-RU', {
        currency: 'usd',
        style: 'currency'
    }).format(node.textContent);
});

const $card = document.querySelector('#card');
//console.log($card);

if ($card) {
    $card.addEventListener('click', event => {
        if (event.target.classList.contains('js-remove')) {
            const id = event.target.dataset.id;
            fetch("/card/remove/" + id, {
                    method: "delete"
                })
                .then(res => res.json())
                .then(card => {
                    if (card.tours.length) {
                        const html = card.tours.map(c => {
                            return `
                            <tr>
                                <td>${c.title}</td>
                                <td>${c.count}</td>
                                <td>
                                    <button class="btn btn-small js-remove" data-id="${c.id}">Delete</button>
                                </td>
                            </tr>
                            `;
                        }).join("");
                        $card.querySelector("tbody").innerHTML = html;
                        $card.querySelector(".price").textContent = card.price;
                    } else {
                        $card.innerHTML = "<p>Card is empty</p>";
                    }
                });
        }
    });
}