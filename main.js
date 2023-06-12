const movieSelect = document.getElementById('movie');
const container = document.querySelector('.container');
const seats = document.querySelectorAll('.row .seat:not(.occupied)');
const count = document.getElementById('count');
const total = document.getElementById('total');

populateUI();

let ticketPrice = + movieSelect.value; // +는 movieSelect.value(피연산자)를 숫자로 변환하는 용도로 사용

function setMovieData(movieIndex, moviePrice){
    localStorage.setItem('selectedMovieIndex', movieIndex);
    localStorage.setItem('selectedMoviePrice', moviePrice);
}

function updateSelectedCount(){
    const selectedSeats = document.querySelectorAll('.row .seat.selected');

    const seatsIndex = [...selectedSeats].map((seat) => [...seats].indexOf(seat));

    localStorage.setItem('selectedSeats', JSON.stringify(seatsIndex));

    const selectedSeatsCount = selectedSeats.length;

    count.innerText = selectedSeatsCount;
    total.innerText = selectedSeatsCount * ticketPrice;
}

function populateUI() {
    const selectedSeats = JSON.parse(localStorage.getItem('selectedSeats'));

    if (selectedSeats !== null && selectedSeats.length > 0) {
        seats.forEach((seat, index) => {
            if (selectedSeats.indexOf(index) > -1) {
                seat.classList.add('selected');
            }
        });
    }

    const selectedMovieIndex = localStorage.getItem('selectedMovieIndex');

    if (selectedMovieIndex !== null){
        movieSelect.selectedIndex = selectedMovieIndex;
    }
}

movieSelect.addEventListener('change', (e) => {
    ticketPrice = +e.target.value;

    setMovieData(e.target.selectedIndex, e.target.value);
    updateSelectedCount();
});


container.addEventListener('click', (e) => {
    if (e.target.classList.contains('seat') && !e.target.classList.contains('occupied')) {
        e.target.classList.toggle('selected');

        updateSelectedCount();
    }
});

updateSelectedCount();

// 결제 수단
function requestPay(){
    IMP.init('imp20520877');
    IMP.request_pay({
        pg : 'html5_inicis',
        pay_method : 'card',
        merchant_uid: 'merchant_'+new Date().getTime(),
        name : '결제테스트',
        amount : total.innerText,
        buyer_email : 'Iamport@chai.finance',
        buyer_name : '포트원',
        buyer_tel : '010-1234-5678',
        buyer_addr : '서울특별시 강남구 삼성동',
        buyer_postcode : '123-456'
    }, function (rsp) {
        console.log(rsp);
        if (rsp.success){
            var msg = '결제가 완료되었습니다';
            alert(msg);
            location.href = "index.html"
        } else {
            var msg = '결제에 실패하였습니다.';
            msg += '에러 내용:' + rsp.error_msg;
            alert(msg);
        }
    });
}