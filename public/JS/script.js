const socket = io();

if(navigator.geolocation)
{
    navigator.geolocation.watchPosition((position)=>
    {
        const {latitude,longitude} = position.coords;
        socket.emit("send-location" , {latitude,longitude})
    },
(error)=>
{
    console.log(error)
},
{
    timeout : 5000,
    maximumAge : 0,
    enableHighAccuracy : true,
})
}

const map = L.map("map").setView([0,0], 10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution : "FunCode"
}).addTo(map)

const marker = {};
socket.on("recieve-location",(data)=>
{
    const {id,latitude,longitude} = data;
    map.setView([latitude,longitude]);
    if(marker[id])
    {
        marker[id].setLatLng([latitude,longitude]);
    }
    else
    {
        marker[id] = L.marker([latitude,longitude]).addTo(map)
    }
})

socket.on("user-disconnect",(id)=>
{
    if(marker[id])
    {
        map.removeLayer(marker[id]);
        delete marker[id];
    }
})