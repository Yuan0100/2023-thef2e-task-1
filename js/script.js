/* eslint-disable no-undef*/

// Apply ScrollTrigger to GSAP
gsap.registerPlugin(ScrollTrigger);

$(document).ready(function () {
  // Navbar
  // Initial position of the navbar
  var initialNavbarPosition = $("#navbar").offset().top;

  // Scroll event listener
  $(window).scroll(function () {
    // Check if the scroll position is not at the top of the page
    if ($(window).scrollTop() > 0) {
      // Use GSAP to animate the navbar to a fixed position
      gsap.to("#navbar", {
        duration: 0.3,
        y: -initialNavbarPosition,
        position: "fixed",
        top: 0,
        backgroundColor: "rgba(253, 252, 251, 0)"
      });
    } else {
      // Reset the position when scrolling back to the top
      gsap.to("#navbar", {
        duration: 0.3,
        y: 0,
        position: "absolute",
        backgroundColor: "rgba(253, 252, 251, 1)"
      });
    }
  });

  // Text marquee
  const texts = gsap.utils.toArray(".marquee_box");
  horizontalLoop(texts, { paused: false, repeat: -1 });

  // Hrizontal Scroll
  // const caseItems = gsap.utils.toArray(".event_card");

  let policyItems = gsap.utils.toArray($(".policy_list").find(".policy_card"));
  // console.log(policyItems);
  let tlCaseList = gsap.timeline({
    scrollTrigger: {
      trigger: ".policy_section",
      pin: true,
      scrub: 1,
      snap: 1 / (policyItems.length - 1),
      start: "center center",
      end: () => "+=" + $(".policy_list").width(),
      // markers: true
    }
  });

  tlCaseList.to(".policy_card", {
    xPercent: -100 * (policyItems.length - 1),
    ease: "none"
  });

  // Toggle Donation Input Area

  let donateOptions = gsap.utils.toArray(
    $("#wf-form-Donation-Form .option__clickable-area")
  );
  donateOptions.forEach((option) => {
    $(option).on("click", function () {
      if ($(this).siblings("input").attr("id") !== "custom") {
        $("#custom-input").addClass("hidden");
        $("#custom-dollars").attr("required", false);
      } else {
        $("#custom-input").removeClass("hidden");
        $("#custom-dollars").attr("required", true);
      }
    });
  });

  // Toggle Modal

  let modals = gsap.utils.toArray($(".modal"));

  $(".modal_wrap").on("click", function (e) {
    if (e.target === this) {
      $(this).addClass("hidden");
      modals.forEach((modal) => {
        if (!$(modal).hasClass("hidden")) {
          $(modal).addClass("hidden");
        }
      });
    }
  });
  $(".close_modal").on("click", function () {
    $(".modal_wrap").addClass("hidden");
    modals.forEach((modal) => {
      if (!$(modal).hasClass("hidden")) {
        $(modal).addClass("hidden");
      }
    });
  });

  // Open donate modal

  $("#donate-btn").on("click", function () {
    $(".modal_wrap").removeClass("hidden");
    $("#donate-modal").removeClass("hidden");
  });

  // Open service modal

  $("#service-btn").on("click", function () {
    $(".modal_wrap").removeClass("hidden");
    $("#service-modal").removeClass("hidden");
  });

  // Open event modal

  $(".event_card").on("click", function () {
    // console.log($(this).attr("id"));
    $(".modal_wrap").removeClass("hidden");
    $("#event-modal").removeClass("hidden");
  });
  // $(".more__event_card").on("click", function () {
  //   // console.log($(this).attr("id"));
  //   $(".modal_wrap").removeClass("hidden");
  //   $("#event-modal").removeClass("hidden");
  // });

  // Open policy modal

  $(".policy_card__btn").on("click", function () {
    // console.log($(this).attr("id"));
    $(".modal_wrap").removeClass("hidden");
    $("#policy-modal").removeClass("hidden");
  });
  // $(".more__policy_card").on("click", function () {
  //   // console.log($(this).attr("id"));
  //   $(".modal_wrap").removeClass("hidden");
  //   $("#policy-modal").removeClass("hidden");
  // });
});

// --- Looping text

function horizontalLoop(items, config) {
  items = gsap.utils.toArray(items);
  config = config || {};
  let tl = gsap.timeline({
      repeat: config.repeat,
      paused: config.paused,
      defaults: { ease: "none" },
      onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100)
    }),
    length = items.length,
    startX = items[0].offsetLeft,
    times = [],
    widths = [],
    xPercents = [],
    curIndex = 0,
    pixelsPerSecond = (config.speed || 1) * 100,
    snap = config.snap === false ? (v) => v : gsap.utils.snap(config.snap || 1), // some browsers shift by a pixel to accommodate flex layouts, so for example if width is 20% the first element's width might be 242px, and the next 243px, alternating back and forth. So we snap to 5 percentage points to make things look more natural
    totalWidth,
    curX,
    distanceToStart,
    distanceToLoop,
    item,
    i;
  gsap.set(items, {
    // convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
    xPercent: (i, el) => {
      let w = (widths[i] = parseFloat(gsap.getProperty(el, "width", "px")));
      xPercents[i] = snap(
        (parseFloat(gsap.getProperty(el, "x", "px")) / w) * 100 +
          gsap.getProperty(el, "xPercent")
      );
      return xPercents[i];
    }
  });
  gsap.set(items, { x: 0 });
  totalWidth =
    items[length - 1].offsetLeft +
    (xPercents[length - 1] / 100) * widths[length - 1] -
    startX +
    items[length - 1].offsetWidth *
      gsap.getProperty(items[length - 1], "scaleX") +
    (parseFloat(config.paddingRight) || 0);
  for (i = 0; i < length; i++) {
    item = items[i];
    curX = (xPercents[i] / 100) * widths[i];
    distanceToStart = item.offsetLeft + curX - startX;
    distanceToLoop =
      distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
    tl.to(
      item,
      {
        xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
        duration: distanceToLoop / pixelsPerSecond
      },
      0
    )
      .fromTo(
        item,
        {
          xPercent: snap(
            ((curX - distanceToLoop + totalWidth) / widths[i]) * 100
          )
        },
        {
          xPercent: xPercents[i],
          duration:
            (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
          immediateRender: false
        },
        distanceToLoop / pixelsPerSecond
      )
      .add("label" + i, distanceToStart / pixelsPerSecond);
    times[i] = distanceToStart / pixelsPerSecond;
  }
}


// --- Apply Lenis Smooth Scroll

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
});

function raf(time) {
  lenis.raf(time);
  ScrollTrigger.update();
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);