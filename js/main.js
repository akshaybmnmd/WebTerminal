setInterval(() => {
  // heart beat 500
  if (debug.testcount > 10) {
    if ((debug.imageping.success / debug.imageping.total) * 100 > 95) {
      updateview("\n>\n>\n>\n>\n>\n>sever ping success\n>");
      serverping = true;
    } else {
      serverping = false;
      updateview("\n>\n>\n>\n>\n>\n>sever ping failed\n>");
    }
    if (
      (debug.googleimageping.success / debug.googleimageping.total) * 100 >
      95
    ) {
      updateview("\n>\n>\n>\n>\n>\n>network test passed\n>");
    } else {
      updateview("\n>\n>\n>\n>\n>\n>network test failed\n>");
    }
    if (debug.cmdrequest.success != 0) {
      updateview("\n>\n>\n>\n>\n>\n>command request sucess\n>");
    } else {
      updateview("\n>\n>\n>\n>\n>\n>command request failed\n>");
      serverping = false;
    }
    if (serverping) {
      updateview("\n>\n>\n>\n>\n>\n>test passed.\n");
      $(".cmd").val(">" + user);
    } else {
      updateview("\n>\n>\n>\n>\n>\n>Kernel panic!!");
      console.error("server failed", debug);
    }
    debugreset();
  }
}, 500);

setInterval(() => {
  // heart beat 1000
  if (debug.start) {
    imageping();
    googleimageping();
    requesttest();

    updateview("..");
    debug.testcount++;
  }
}, 1000);
var debug = { start: false, testcount: 0 };

debugreset = () => {
  debug = { start: false, testcount: 0 };
  debug.imageping = { total: 0, success: 0, failed: 0 };
  debug.googleimageping = { total: 0, success: 0, failed: 0 };
  debug.cmdrequest = { total: 0, success: 0, failed: 0 };
};

debugreset();

imageping = () => {
  debug.imageping.total++;
  image = new Image();
  image.onload = (s) => {
    debug.imageping.success++;
  };
  image.onerror = (e) => {
    debug.imageping.failed++;
  };
  image.src = "ping.png?" + Math.random();
};

googleimageping = () => {
  debug.googleimageping.total++;
  image = new Image();
  image.onload = (s) => {
    debug.googleimageping.success++;
  };
  image.onerror = (e) => {
    debug.googleimageping.failed++;
  };
  image.src =
    "https://lh3.googleusercontent.com/ogw/ADGmqu9VrM9GIRbkz2L7pYmaASewso5US0FzNEgul3Yv=s32-c-mo?" +
    Math.random();
};

requesttest = () => {
  if (debug.cmdrequest.total < 5) {
    debug.cmdrequest.total++;
    $.ajax({
      url: "response.php",
      data: data,
      dataType: "JSON",
      type: "POST",
      success: (result, status, xhr) => {
        debug.cmdrequest.success++;
      },
      error: (xhr, status, error) => {
        debug.cmdrequest.failed++;
      },
    });
  }
};

//common
const user = "root$>";
var cmd = "";
var cmdHistory = [];
var viewstate = "";
var data = {};

$(".cmd").val(">" + user);

$(document).keyup((e) => {
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
  data = { action: "run" };
  data.cmd = cmd;
  cmdHistory.push(cmd);
  switch (cmd) {
    case "clear":
      $(".cmd").val(">" + user);
      break;
    case "history":
      cmdHistory.forEach((value, index) => {
        updateview(index + 1 + " => " + value + "\n");
      });
      updateview(">" + user);
      break;
    case "test":
      updateview("You can't test here!!\n>" + user);
      break;
    default:
      $.ajax({
        url: "response.php",
        data: data,
        dataType: "JSON",
        type: "POST",
        success: (result, status, xhr) => {
          furtheraction(result);
          if (result.status == "success") {
            updateview(result.response + "\n>" + user);
          } else {
            updateview(result.error.m + "\n>" + user);
          }
        },
        error: (xhr, status, error) => {
          console.error("error", xhr, status, error);
          updateview("API failed." + "\n>starting diagnosis...\n>\n>");
          debug.start = true;
        },
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

$(".cmd").on({
  input: (e) => {
    tempcmd = e.target.value;
    tempcmd = tempcmd.split("\n")[tempcmd.split("\n").length - 1];
    if (tempcmd.split(user)[1] == undefined) {
      updateview(">");
    }
  },
});

furtheraction = (result) => {
  if (result.status == "success") {
    switch (result.action) {
      case 1001:
        console.log("update user name");
        break;
      default:
        console.log("unknown action!!");
        break;
    }
  }
};
