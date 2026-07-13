function showMessage() {
    alert("백승공 포트폴리오에 오신 것을 환영합니다!");
}

function showTime() {

    const now = new Date();

    document.getElementById("time").innerHTML =
        "현재 시간 : " + now.toLocaleString();

}

function changeColor(){

    const colors = [
        "#f4f4f4",
        "#FFF8DC",
        "#E6F7FF",
        "#E8F5E9",
        "#FCE4EC"
    ];

    const random = Math.floor(Math.random()*colors.length);

    document.body.style.background = colors[random];

}

function changeImage() {
    document.getElementById("profile").src = "zackie2.png";
}

function restoreImage() {
    document.getElementById("profile").src = "zackie1.png";
}