const convertButton = document.querySelector(".convertButton");
const currencySelect = document.querySelector(".currency-select");

async function getExchangeRate(toCurrency) {
    try {
        if (toCurrency === "bitcoin") {
            return await getBTCToday();
        }

        const apiKey = "cur_live_tb4rJm4GcxX8hlF0m77TUQ7IBbT4rrPzSyMuvzH2"; // 🔥 Substitua pela chave válida
        const response = await fetch(`https://api.currencyapi.com/v3/latest?apikey=${apiKey}&currencies=${toCurrency.toUpperCase()}&base_currency=BRL`);
        
        console.log("Status da resposta da API:", response.status); // 🔍 Debug para conferir o status
        
        if (!response.ok) throw new Error("Erro na requisição da API!");

        const data = await response.json();
        console.log("Dados da API CurrencyAPI:", data);

        if (!data.data || !data.data[toCurrency.toUpperCase()]) {
            console.error(`Taxa de câmbio para ${toCurrency} não disponível.`);
            return null;
        }

        return data.data[toCurrency.toUpperCase()].value;
    } catch (error) {
        console.error("Erro ao obter taxa de câmbio:", error);
        return null;
    }
}

async function getBTCToday() {
    try {
        const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=brl");
        if (!response.ok) throw new Error("Erro na requisição da API de Bitcoin!");

        const data = await response.json();
        console.log("Cotação do Bitcoin em BRL:", data.bitcoin.brl);

        return data.bitcoin.brl;
    } catch (error) {
        console.error("Erro ao obter cotação do Bitcoin:", error);
        return null;
    }
}

async function convertValues() {
    const inputCurrency = document.querySelector(".inputCurrency").value;
    const currencyValueToConvert = document.querySelector(".currency-value-to-convert");
    const currencyValue = document.querySelector(".currency-value");
    const amountInReal = parseFloat(inputCurrency);

    if (isNaN(amountInReal) || amountInReal <= 0) {
        alert("Por favor, insira um valor válido em reais.");
        return;
    }

    currencyValueToConvert.innerHTML = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(amountInReal);

    const currencyMap = {
        dolar: "usd",
        euro: "eur",
        libra: "gbp",
        btc: "bitcoin"
    };

    let convertedValue;
    const selectedCurrency = currencyMap[currencySelect.value];

    if (selectedCurrency === "bitcoin") {
        const btcToday = await getBTCToday();
        if (!btcToday) {
            currencyValue.innerHTML = "Erro na conversão";
            return;
        }
        convertedValue = (amountInReal / btcToday).toFixed(10) + " BTC";
    } else {
        const rate = await getExchangeRate(selectedCurrency);

        if (!rate || rate === null) {
            currencyValue.innerHTML = "Erro na conversão: taxa de câmbio não encontrada!";
            console.error("Taxa de câmbio não disponível para:", selectedCurrency);
            return;
        }

        convertedValue = new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: selectedCurrency
        }).format(amountInReal * rate);
    }

    console.log(`Convertendo ${amountInReal} BRL para ${selectedCurrency}: ${convertedValue}`);

    currencyValue.innerHTML = convertedValue;
}

function changeCurrency() {
    const currencyName = document.getElementById("currency-name");
    const currencyImg = document.querySelector(".currency-img");

    const currencyData = {
        dolar: { name: "Dólar Americano", img: "./assets/dollar.png" },
        euro: { name: "Euro", img: "./assets/euro.png" },
        libra: { name: "Libra Esterlina", img: "./assets/libra.png" },
        btc: { name: "Bitcoin", img: "./assets/bitcoin.png" }
    };

    const selectedCurrency = currencySelect.value;
    currencyName.innerHTML = currencyData[selectedCurrency].name;
    currencyImg.src = currencyData[selectedCurrency].img;

    convertValues();
}

currencySelect.addEventListener("change", changeCurrency);
convertButton.addEventListener("click", convertValues);