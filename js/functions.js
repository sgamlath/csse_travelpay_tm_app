/**
 * 
 */

function showAddRoutes() {
    $('#main').hide();
    $('#addRoutes').show();
    $('#updateRoutes').hide();
    $('#addFareList').hide();
    $('#updateFareList').hide();
}
function showUpdateRoutes() {
    getRoutes();
    $('#main').hide();
    $('#addRoutes').hide();
    $('#updateRoutes').show();
    $('#addFareList').hide();
    $('#updateFareList').hide();
}
function showAddFareList() {
    $('#main').hide();
    $('#addRoutes').hide();
    $('#updateRoutes').hide();
    $('#addFareList').show();
    $('#updateFareList').hide();
}
function showUpdateFareList() {
    $('#main').hide();
    $('#addRoutes').hide();
    $('#updateRoutes').hide();
    $('#addFareList').hide();
    $('#updateFareList').show();
}
function backToMenu() {
    $('#main').show();
    $('#addRoutes').hide();
    $('#updateRoutes').hide();
    $('#addFareList').hide();
    $('#updateFareList').hide();
}

var routes = [];
var routeNumList = [];
var fareList = {};
var currentRoute = {
    "busRouteNumber": "",
    "busRouteName": "",
    "active": true,
    "haltList": []
};
var currentHaltNum = 0;
var currentHaltDetails = {};

function initializeData() {
    console.log("initializeData()");
    routes = [];
    routeNumList = [];
    fareList = {};
    currentRoute = {
        "busRouteNumber": "",
        "busRouteName": "",
        "active": true,
        "haltList": []
    };
    currentHaltNum = 0;
    currentHaltDetails = {};
}

function addNewRoute() {
    initializeData();
    let routeNum = $("#routeNum_add").val();
    let routeName = $("#routeName_add").val();

    if (routeNum.length > 0) {
        currentRoute.busRouteNumber = routeNum;
        currentRoute.busRouteName = routeName;
        saveRoute();
    }

    initializeData();
}

function deleteRoute() {
    currentRoute.active = false;
    saveRoute();

    initializeData();
    getRoutes();
}

function getRoutes() {
    console.log("getRoutes()");

    initializeData();

    $("#incBtn").html("Next");

    jQuery.ajax({
        url: "http://localhost:9090/route/getAllActive",
        type: "GET",
        contentType: "application/json",
        dataType: 'json',
        success: function (data, textStatus, errorThrown) {
            // console.log(data);
            routes = data;
            routeNumList = [];
            jQuery.each(data, function (k, v) {
                routeNumList.push({
                    "busRouteId": data[k].busRouteId,
                    "busRouteNumber": data[k].busRouteNumber
                });
            });
            // console.log(routeNumList);
            // console.log(getRoute(routeNumList[0]));
            $('#routeList').empty();
            routeNumList.forEach((item, index) => {
                var routeOption = ('<option value="' + item.busRouteId + '">' + item.busRouteNumber + '</option>');
                // console.log(data[k].id + ")" + data[k].name + " - Rs." + data[k].price);
                $('#routeList').append(routeOption);
            });
            setCurrentRoute();


        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("ERROR!");
        },
        timeout: 120000,
    });
};

function getRoute(routeNo) {
    console.log("getRoute(" + routeNo + ")");

    let route = routes.filter(val => {
        return val.busRouteNumber == routeNo;
    });
    if (route.length > 0) {
        route = route[0];
    } else {
        route = {};
    }
    return route;

};

function setCurrentRoute() {
    console.log("setCurrentRoute()");

    currentRoute = getRoute($("#routeList :selected").text());

    $("#routeName").val(currentRoute.busRouteName);

    currentHaltNum = 0;
    $("#haltNum").text(currentHaltNum + 1);
    console.log(currentRoute);
    getCurrentHaltDetails(currentHaltNum);
};

function setRouteNumNew() {
    console.log("setRouteNumNew()");
    currentRoute.busRouteNumber = $("#routeNum_add").val();
};

function setRouteNameNew() {
    console.log("setRouteNameNew()");
    currentRoute.busRouteName = $("#routeName_add").val();
};

function setRouteName() {
    console.log("setRouteName()");
    currentRoute.busRouteName = $("#routeName").val();
};

function setHaltName() {
    console.log("setHaltName()");
    currentHaltDetails.name = $("#haltName").val();
}
function setHaltDistance() {
    console.log("setRouteDistance()");
    currentHaltDetails.distance = $("#haltDistance").val();
};

function setHaltLatitude() {
    console.log("setHaltLatitude()");
    currentHaltDetails.latitude = $("#haltLatitude").val();
};

function setHaltLongitude() {
    console.log("setHaltLongitude()");
    currentHaltDetails.longitude = $("#haltLongitude").val();
};

function decHaltNum() {
    console.log("decHaltNum()");
    currentHaltNum = parseInt($("#haltNum").text()) - 1;
    if (currentHaltNum > 0) {
        currentHaltNum--;
        $("#incBtn").html("Next");
    }
    getCurrentHaltDetails(currentHaltNum);

};

function incHaltNum() {
    console.log("incHaltNum()");
    let currentHaltName = $("#haltName").val();
    if (currentHaltName.length > 0) {
        currentHaltNum = parseInt($("#haltNum").text()) - 1;
        if ((currentHaltNum) >= currentRoute.haltList.length) {
            console.log(currentHaltDetails);
            currentRoute.haltList.push(currentHaltDetails);
        } else {
        }
        currentHaltNum++;

        if ((currentHaltNum) >= currentRoute.haltList.length) {
            $("#incBtn").html("Add");
        } else {
            $("#incBtn").html("Next");
        }

        getCurrentHaltDetails(currentHaltNum);
    } else {
        alert("Halt name is reqired");
    }
};

function getCurrentHaltDetails(index) {
    console.log("getCurrentHaltDetails(" + index + ")");
    let halt = currentRoute.haltList.filter(val => {
        return val.index == index;
    });
    if (halt.length > 0) {
        currentHaltDetails = halt[0];
    } else {
        currentHaltDetails = {
            "index": index,
            "name": "",
            "distance": "",
            "longitude": "",
            "latitude": ""
        }
    }
    $("#haltNum").text(parseInt(currentHaltDetails.index) + 1);
    $("#haltName").val(currentHaltDetails.name);
    $("#haltDistance").val(currentHaltDetails.distance);
    $("#haltLongitude").val(currentHaltDetails.longitude);
    $("#haltLatitude").val(currentHaltDetails.latitude);

};

function backRoute() {
    console.log("currentRoute");
    console.log(currentRoute);

    console.log("currentHaltDetails");
    console.log(currentHaltDetails);

    console.log("routes");
    console.log(routes);

}

function saveRoute() {
    console.log("currentRoute");
    console.log(currentRoute);

    console.log("currentRoute");
    jQuery.ajax({
        url: "http://localhost:9090/route/add",
        type: "POST",
        contentType: "application/json",
        dataType: 'json',
        data: JSON.stringify(currentRoute),
        success: function (data, textStatus, errorThrown) {
            console.log(data);
            if(data.active){
                alert("Route added successfully")
            }else{
                alert("Route deleted successfully")
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("ERROR!");
            if(currentRoute.active==true){
                alert("Failed to add route")
            }else{
                alert("Failed to delete route")
            }
            
        },
        timeout: 120000,
    });
}

function updateFareList() {
    let minfare = parseFloat($("#minFare").val());
    let incPercentage = parseFloat($("#incPercentage").val());

    if (minfare > 0 && incPercentage >= 0) {
        jQuery.ajax({
            url: "http://localhost:9090/route/updateFareList",
            type: "POST",
            contentType: "application/json",
            dataType: 'json',
            data: JSON.stringify({
                "fareListId": "001",
                "minFare": minfare,
                "incrementPercentage": incPercentage
            }),
            success: function (data, textStatus, errorThrown) {
                console.log(data);
                alert("Fare list updated successfully")
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("ERROR!");
                alert("Failed to update fare list")
            },
            timeout: 120000,
        });
    } else {
        alert("Please enter valid amounts to update!")
    }
}