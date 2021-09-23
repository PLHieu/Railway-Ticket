var listStation = [];
var listTrain = [];
var listCoach = [];
var listSeat = [];
var listTicket = [];
var leaveStation = null;
var arriveStation = null;
var departdate = null;
var trainselected = null;
var coachselected = null;
var listSeatSelected = [];
var socket = io();

socket.on('connect', () => {
  console.log('Client connect to server socket sucessfully');
  // console.log(socket.id);
});
socket.on('disconnect', (reason) => {
  if (reason === 'io server disconnect') {
    socket.connect();
  }
  // else the socket will automatically try to reconnect
});

socket.on('event', (data) => {
  switch (data.code) {
    // case 1:
    //   console.log('hold successfully');
    //   holdTicket(data.data.seatPosition.seat);
    //   break;

    case 2:
      console.log('hold fail');
      break;

    // case 3:
    //   console.log('unhold successfully');
    //   unholdTicket(data.data.idSeat);
    //   break;

    case 4:
      console.log('unhold fail');
      break;

    case 5:
      /*
                khi mot nguoi khac o cung toa holdticket thanh cong thi server thong bao su kien nay den minh  
            */
      console.log('someone hold seat');
      soHoldTicket(data.data);
      break;

    case 7:
      /*
                khi mot nguoi khac o cung toa unholdticket thanh cong thi server thong bao su kien nay den minh  
            */
      console.log('someone unhold seat');
      soUnHoldTicket(data.data);
      break;

    // case 6:
    //   listSeat = data.data;
    //   renderListSeat(listSeat);
    //   break;

    case 8:
      /*
                Mua ve thanh cong
            */
      $('#formid').html(
        `<p>Bạn đã đăng ký thành công, mã đơn hàng của bạn: ${data.data.codecart}</p>`,
      );
      $('.listticket')
        .html(`<p class=" noticket card-text font-weight-bold text-xl-center " style="margin-bottom: 5px;">No ticket
            </p>`);
      break;

    case 12:
      /*
                khi mot nguoi khac o cung toa mua ve thanh cong thi server thong bao su kien nay den minh  
            */
      console.log('someone bought seat');
      soBoughtTicket(data.data);
      break;

    case 15:
      /*
                khi nguoi khac huy thanh toan ve tau 
            */
      console.log("SO's payment fail");
      console.log(data.data);
      soUnBoughtTicket(data.data);
      break;

    default:
      break;
  }
});

$(document).ready(function () {
  $('#btnSearch').click(onClickSearchTrain);
  $('.listtrain').on('click', '.train', onClickSearchCoach);
  $('.listcoach').on('click', '.coach', onClickSearchSeat);
  $('.listseat-container').on('click', '.seat', onClickTicket);
  $('#btnbuyticket').click(onClickBuyTicket);

  renderListStation();
});

function onClickTicket() {
  let information = {
    train: trainselected.id,
    coach: coachselected.id,
    seat: parseInt(this.id),
    departTime: trainselected.departTime,
    leaveStation,
    arriveStation,
    verStructure: trainselected.verStructure,
    holdingTime: new Date(),
    leaveTime: trainselected.arriveTime,
  };

  if (
    listSeatSelected.includes(
      JSON.stringify({
        train: trainselected.id,
        coach: coachselected.id,
        seat: parseInt(this.id),
        verStructure: trainselected.verStructure,
      }),
    )
  ) {
    console.log('unhold');
    socket.emit('unhold-ticket', information, ({ data, code }) => {
      unholdTicket(data.ticket);
    });
  } else {
    console.log('hold');
    socket.emit('hold-ticket', information, ({ data, code }) => {
      holdTicket(data.ticket);
    });
  }
}

function onClickSearchSeat() {
  if (this.id == 'headcoach') {
    return;
  }
  listSeatSelected = [];
  coachselected = findCoachByID(parseInt(this.id));
  // console.log("coach" + coachselected.IDToa + "selected");
  socket.emit(
    'search-seat',
    {
      train: trainselected.id,
      coach: coachselected.id,
      leaveStation,
      arriveStation,
      departTime: trainselected.departTime,
      verStructure: trainselected.verStructure,
    },
    (data) => {
      renderListSeat(data.data);
    },
  );
}

function onClickSearchTrain() {
  listSeatSelected = [];
  // hide instruction , show loading
  $loading = $('#loading-self');
  $howtouse = $('#howtouse');
  $notfound = $('#notfound');

  $howtouse.addClass('hide');
  $notfound.removeClass('show');
  $loading.addClass('show');

  // empty all result had been shown before
  $('.listtrain').empty();
  $('.listcoach').empty();
  $('.listseat-container').empty();

  leaveStation = $('#formDepart').val();
  arriveStation = $('#formArrive').val();

  $.post(
    '/arrangedtrain/search',
    {
      leaveStation,
      arriveStation,
      departDate:
        $('#formDepartDate').datepicker('getDate').getFullYear() +
        '-' +
        ($('#formDepartDate').datepicker('getDate').getMonth() + 1) +
        '-' +
        $('#formDepartDate').datepicker('getDate').getDate(),
    },
    function (data) {
      listTrain = data;
      // render list of train
      renderListTrain(listTrain);
    },
  )
    .always(function () {
      $loading.removeClass('show');
    })
    .fail(function (data, status) {
      $notfound.addClass('show');
    });
}
function onClickBuyTicket() {
  val = $('.noticket').text();
  if (val.length > 0) {
    return;
  }
  $.post('/api/getticketsession', function (data) {
    listTicket = data;
  });
  $train = $('.listtrain');
  $coach = $('.listcoach-container');
  $seat = $('.listseat-container');

  $train.remove();
  $coach.remove();
  $seat.remove();
  $user = $('.thanhtoan-container');
  $user.html(`<form id = "formid">
                    <div class="col-sm-6">
                        Họ và tên: <input class="form-control" type="text" placeholder="Họ và tên" id="username"> <br>
                        Ngày sinh: <input class="form-control" type="text" placeholder="Ngày sinh" id="userbirthday"> <br>
                        Quê quán: <input class="form-control" type="text" placeholder="Quê quán" id="userlocation"> <br>
                        <a id="btnInfor" class="btn btn-primary align-items-left my-3" type= "submit">Thanh toán</a>
                    </div>
                    <div class="col-sm-6">
                        CMND: <input class="form-control" type="text" placeholder="CMND" id="usercmnd"> <br>
                        Số điện thoại: <input class="form-control" type="text" placeholder="Số điện thoại" id="userphone"> 
                    </div>
                    
                 </form>`);
  $('#userbirthday').datetimepicker({
    format: 'd/m/Y',
    timepicker: false,
    mask: true,
    maxDate: new Date(),
  });
  $('#btnInfor').click(function () {
    $('#formid').submit();
  });
  $('#formid').submit(function (e) {
    e.preventDefault();
    textbd = $('#userbirthday').val();
    text = $('#username').val();
    if (checkEmptyString(text)) {
      window.alert('Tên không được rỗng');
      return;
    }
    if (checkEmptyString($('#usercmnd').val())) {
      window.alert('Chứng minh nhân dân không được rỗng');
      return;
    }
    if (checkEmptyString($('#userlocation').val())) {
      window.alert('Quê quán không được rỗng');
      return;
    }
    if (checkEmptyString($('#userphone').val())) {
      window.alert('Số điện thoại không được rỗng');
      return;
    }
    if (checkEmptyString($('#userbirthday').val())) {
      window.alert('Ngày sinh không được rỗng');
      return;
    }
    if (validNumber($('#userphone').val())) {
      window.alert('Số điện thoại không khả dụng');
      return;
    }
    if (validNumber($('#usercmnd').val())) {
      window.alert('Chứng minh nhân dân không khả dụng');
      return;
    }
    bd = textbd.slice(6) + '-' + textbd.slice(3, 5) + '-' + textbd.slice(0, 2);
    let userinfor = {
      name: $('#username').val(),
      cmnd: $('#usercmnd').val(),
      birthday: bd,
      location: $('#userlocation').val(),
      phone: $('#userphone').val(),
    };
    let ticketdata = {
      listTicket,
      userinfor,
    };
    socket.emit('boughtticket', ticketdata);
  });
}
function onClickSearchCoach() {
  listSeatSelected = [];
  trainselected = findTrainByID(this.id);
  // console.log(trainselected.IDTau + "selected");
  // console.log(trainselected)
  // clear result
  $('.listcoach').empty();
  $('.listseat-container').empty();

  // show loading, hide notfound image
  $loading = $('#loading-self');
  $notfound = $('#notfound');
  $notfound.removeClass('show');
  $loading.addClass('show');

  $.post(
    '/coach/search',
    {
      id: trainselected.id,
      ver: trainselected.verStructure,
    },
    function (data) {
      listCoach = data;
      // render list of coach
      renderListCoach(listCoach);
    },
  )
    .always(function () {
      $loading.removeClass('show');
    })
    .fail(function (data, status) {
      $notfound.addClass('show');
    });
}

//render list seat
function renderListSeat(listseat) {
  $('.listseat-container').empty();
  $('.listseat-container').append(
    `<p>Toa số ${
      coachselected.id +
      ' - Tàu ' +
      coachselected.train +
      ': ' +
      coachselected.type.name
    }</p>`,
  );
  $('.listseat-container').append(`<div class="listseat"></div>`);
  $listseatDOM = $('.listseat');
  let numSeat = listseat.length;
  let countSeat = 1;
  if (getMainCoachType(coachselected.type.id) === 'GN') {
    let numCabin = numSeat / 6;
    for (let i = 0; i < numCabin; i++) {
      let $cabin = $('<div>', { class: 'cabin' });
      for (let j = 0; j < 3; j++) {
        let $floor = $('<div>', { class: 'floor' });
        $floor.append(
          `<span class="seat ${getListSeatStatusString(
            listseat[countSeat - 1].status,
          )}" id=${countSeat + 'S'}>${countSeat}</span>`,
        );
        countSeat++;
        $floor.append(
          `<span class="seat ${getListSeatStatusString(
            listseat[countSeat - 1].status,
          )}" id=${countSeat + 'S'}>${countSeat}</span>`,
        );
        countSeat++;
        $cabin.append($floor);
      }
      $listseatDOM.append($cabin);
    }
  } else if (
    getMainCoachType(coachselected.type.id) === 'GC' ||
    getMainCoachType(coachselected.type.id) === 'GM'
  ) {
    let numSeatOneRow = numSeat / 4;
    for (let i = 0; i < 2; i++) {
      let $cabin = $('<div>', { class: 'cabin' });
      for (let j = 0; j < 2; j++) {
        let $floor = $('<div>', { class: 'floor' });
        for (let k = 0; k < numSeatOneRow; k++) {
          $floor.append(
            `<span class="seat ${getListSeatStatusString(
              listseat[countSeat - 1].status,
            )}" id=${countSeat + 'S'}>${countSeat}</span>`,
          );
          countSeat++;
        }
        $cabin.append($floor);
      }

      if (i == 0) {
        $cabin.addClass('leftcabin');
      } else {
        $cabin.addClass('rightcabin');
      }

      $listseatDOM.append($cabin);

      if (i == 0) {
        $listseatDOM.append(`<span class="middletable"></span>`);
      }
    }
    $listseatDOM.addClass('chair');
  }
  $listseatDOM.addClass(coachselected.type.id);
}

//render list station for selection
function renderListStation() {
  $.get('/station', function (data, status) {
    listStation = data;
    listStation.forEach((station, index) => {
      $('#formDepart').append(
        `<option id="${station['id']}" value="${station['id']}">${station['name']}</option>`,
      );
      $('#formArrive').append(
        `<option id="${station['id']}" value="${station['id']}">${station['name']}</option>`,
      );
    });
  }).fail((data, status) => {
    console.log('Error when getting listStation');
  });
}

// render list train
function renderListTrain(listtrain) {
  // clear listrain DOM
  $('.listtrain').empty();
  for (let i = 0; i < listtrain.length; i++) {
    let $train = $('<div>', { class: 'train', id: listtrain[i].id });
    $train.append(`<div class="name" >${listtrain[i].id}</div>`);
    $train.append(`<div class="information">
                            <table>
                            <tr>
                                <td>Arrive Time</td>
                                <td>${getDateTimeString(
                                  new Date(listtrain[i].arriveTime),
                                )}</td>
                            </tr>
                            <tr>
                                <td>Depart Time</td>
                                <td>${getDateTimeString(
                                  new Date(listtrain[i].leaveTime),
                                )}</td>
                            </tr>
                            </table>
                        </div>`);
    $('.listtrain').append($train);
  }
}

// render listcoach
function renderListCoach(listcoach) {
  //clear listcoach
  $('.listcoach').empty();
  for (let i = 0; i < listcoach.length; i++) {
    let $onecoach_wraper = $('<div>', { class: 'coachwraper' });
    let $onecoach = $('<div>', {
      class: 'coach',
      id: listcoach[i].id + 'C',
    });
    $onecoach.append(`<span class="window"></span>
        <span class="window"></span>
        <span class="window"></span>`);
    $onecoach.addClass(listcoach[i].type.id);

    $onecoach_wraper.append(
      `<div class="coach-name">Toa ${listcoach[i].id}</div>`,
    );
    $onecoach_wraper.append($onecoach);
    $('.listcoach').append($onecoach_wraper);
  }
  $('.listcoach').append(`<div class="coachwraper headcoach">
    <div class="coach-name"></div>
    <div class="coach " id="headcoach">
        <span class="window"></span>
        <span class="window"></span>
        <span class="window"></span>
    </div>
    </div>`);
}

function holdTicket(ticket) {
  listSeatSelected.push(JSON.stringify(ticket.seatPosition));
  const id = `#${ticket.seatPosition.seat}S`;
  $(id).addClass('bought');
}

function unholdTicket(ticket) {
  const index = listSeatSelected.indexOf(JSON.stringify(ticket.seatPosition));
  if (index > -1) {
    listSeatSelected.splice(index, 1);
  }

  const id = `#${ticket.seatPosition.seat}S`;
  // const idticket = `#ticket${coachselected.train}_${coachselected.idCoach}_${idseat}_${leaveStation}_${arriveStation}`;
  // $(idticket).remove();
  $(id).removeClass('bought');
}

function soHoldTicket(data) {
  $.post(
    '/station/checkoverlap/',
    {
      firstLeaveStation: leaveStation,
      firstArriveStation: arriveStation,
      secondLeaveStation: data.leaveStation,
      secondArriveStation: data.arriveStation,
    },
    function (res) {
      if (res.data.overLapped) {
        const id = `#${data.seat}S`;
        $(id).addClass('holding');
      }
    },
  );
}

function soUnHoldTicket(data) {
  $.post(
    '/station/checkoverlap/',
    {
      firstLeaveStation: leaveStation,
      firstArriveStation: arriveStation,
      secondLeaveStation: data.leaveStation,
      secondArriveStation: data.arriveStation,
    },
    function (res) {
      if (res.data.overLapped) {
        const id = `#${data.seat}S`;
        $(id).removeClass('holding');
      }
    },
  );
}

function soUnBoughtTicket(data) {
  $.post(
    '/api/checkoverlap/',
    {
      firstLeaveStation: leaveStation,
      firstArriveStation: arriveStation,
      secondLeaveStation: data.leaveStation,
      secondArriveStation: data.arriveStation,
    },
    function (res) {
      if (res.data.overLapped) {
        const id = `#${data.idSeat}S`;
        $(id).removeClass('order');
      }
    },
  );
}

function soBoughtTicket(data) {
  $.post(
    '/api/checkoverlap/',
    {
      firstLeaveStation: leaveStation,
      firstArriveStation: arriveStation,
      secondLeaveStation: data.leaveStation,
      secondArriveStation: data.arriveStation,
    },
    function (res) {
      if (res.data.overLapped) {
        const id = `#${data.idSeat}S`;
        $(id).removeClass('holding');
        $(id).addClass('order');
      }
    },
  );
}

// --------------------utils function
function getListSeatStatusString(status) {
  switch (status) {
    case 0:
      return 'empty';
    case 1:
      return 'order';
    case 2:
      return 'holding';
    case 3:
      return 'bought';
    default:
      return '';
  }
}

function getFirstDepartTimeFromTrainID(idtrain) {
  for (let i = 0; i < listTrain.length; i++) {
    if (listTrain[i]['IDTau'] === idtrain) {
      return listTrain[i]['GioXuatPhat'];
    }
  }
  return 'null';
}

function findTrainByID(idtrain) {
  let n = listTrain.length;
  for (let i = 0; i < n; i++) {
    if (listTrain[i].id == idtrain) {
      return listTrain[i];
    }
  }
  return false;
}

function findCoachByID(idcoach) {
  let n = listCoach.length;
  for (let i = 0; i < n; i++) {
    if (listCoach[i].id == idcoach) {
      return listCoach[i];
    }
  }
  return false;
}

function getMainCoachType(detailCoachType) {
  return detailCoachType.substring(0, 2);
}
function checkEmptyString(str) {
  if (str.length == 0 || str == '__/__/____') {
    return true;
  }
  return false;
}
function validNumber(str) {
  if (isNaN(str)) {
    return true;
  }
  return false;
}

function getDateTimeString(datetime_obj) {
  return (
    datetime_obj.getDate() +
    '-' +
    (datetime_obj.getMonth() + 1) +
    ' ' +
    datetime_obj.getHours() +
    ':' +
    datetime_obj.getMinutes()
  );
}
