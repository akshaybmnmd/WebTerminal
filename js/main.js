setInterval(() => {
  // heart beat 500
  //   $(".indicator")[0].style.display =
  //     $(".indicator")[0].style.display == "none" ? "" : "none";
}, 500);

setInterval(() => {
  // heart beat 1000
}, 1000);

const user = "root$>";
var cmd = "";
var cmdHistory = [];
var viewstate = "";
$(".cmd").val(user);

// $(".cmd").change((e) => {
//   updatecmd();
// });

$(document).keyup((e) => {
  // console.log(e.keyCode);
  switch (e.keyCode) {
    case 13:
      if (updatecmd()) execute();
      else updateview(user);
      viewstate = $(".cmd").val();
      historylength = cmdHistory.length + 1;
      break;
    case 38:
      historyup();
      break;
    case 40:
      historydown();
      break;
    default:
      updateview("");
      break;
  }
});

execute = () => {
  var data = { action: "run" };
  data.cmd = cmd;
  cmdHistory.push(cmd);
  // console.log("run", data);
  switch (cmd) {
    case "clear":
      $(".cmd").val(user);
      break;
    case "history":
      cmdHistory.forEach((value, index) => {
        updateview(index + 1 + " => " + value + "\n");
      });
      updateview(user);
      break;
    default:
      $.post("response.php", data, function (result) {
        //   $("span").html(result);
        updateview(result + "\n" + user);
      });
      break;
  }
};

updatecmd = () => {
  tempcmd = $(".cmd").val();
  tempcmd = tempcmd.split("\n")[tempcmd.split("\n").length - 2];
  cmd = tempcmd.split(user)[1];
  return cmd;
};

updateview = (string) => {
  $(".cmd").val($(".cmd").val() + string);
};

historyup = () => {
  historylength--;
  historylength = historylength < 0 ? 0 : historylength;
  historylength =
    historylength > cmdHistory.length ? cmdHistory.length - 1 : historylength;
  $(".cmd").val(viewstate + cmdHistory[historylength]);
};

historydown = () => {
  historylength++;
  historylength = historylength < 0 ? 0 : historylength;
  historylength =
    historylength >= cmdHistory.length ? cmdHistory.length - 1 : historylength;
  $(".cmd").val(viewstate + cmdHistory[historylength]);
};
