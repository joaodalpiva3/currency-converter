const convertButton = document.querySelector(".convertButton") // Variavel que Seleciona o primeiro elemento HTML com a classe convertButton e armazena sua referência na constante convertButton.
const currencySelect = document.querySelector(".currency-select")

async function getBTCToday() {
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=brl")
    const data = await response.json()
    return data.bitcoin.brl
}

async function convertValues() {
    const inputCurrency = document.querySelector(".inputCurrency").value// pega somente o valor de dentro do input com o .value
    const currencyValueToConvert = document.querySelector(".currency-value-to-convert")
    const currencyValue = document.querySelector(".currency-value")
    const amountInReal = parseFloat(inputCurrency) // converte o valor da string(variavel) em numero decimal(float)

    if (isNaN(amountInReal) || amountInReal <= 0) {
        alert("Por favor, insere um valor válido em reais.")
        return
    }

   
    const dollarToday = 5.6
    const euroToday = 6.3
    const libraToday = 7.5
    const btcToday = await getBTCToday()



        currencyValueToConvert.innerHTML = new Intl.NumberFormat("pt-BR", {
            style: "currency", currency: "BRL"
        }).format(inputCurrency)

    if (currencySelect.value == "dolar") {
        currencyValue.innerHTML = new Intl.NumberFormat("en-US", {
            style: "currency", currency: "USD"
        }).format(amountInReal / dollarToday)

    }

    if (currencySelect.value == "euro") {
        currencyValue.innerHTML = new Intl.NumberFormat("de-DE", {
            style: "currency", currency: "EUR"
        }).format(amountInReal / euroToday)

    }

    if (currencySelect.value == "libra") {
        currencyValue.innerHTML = new Intl.NumberFormat("en-GB", {
            style: "currency", currency: "GBP"
        }).format(amountInReal / libraToday)
    }

    if (currencySelect.value == "btc") {
        currencyValue.innerHTML = (amountInReal / btcToday).toFixed(10) + " BTC"
    }


}

function changeCurrency() {
    const currencyName = document.getElementById("currency-name")
    const currencyImg = document.querySelector(".currency-img")

    if (currencySelect.value == 'dolar') {
        currencyName.innerHTML = 'Dólar Americano'
        currencyImg.src = "./assets/dollar.png"
        
    } else if (currencySelect.value == 'euro') {
        currencyName.innerHTML = 'Euro'
        currencyImg.src = "./assets/euro.png"
    } else if (currencySelect.value == 'libra') {
        currencyName.innerHTML = 'Libra Esterlina'
        currencyImg.src = "./assets/libra.png"
    } else if (currencySelect.value == 'btc') {
        currencyName.innerHTML = 'Bitcoin'
        currencyImg.src = "./assets/bitcoin.png"
    }
    
    convertValues()
}

currencySelect.addEventListener("change", changeCurrency)
convertButton.addEventListener("click", convertValues)