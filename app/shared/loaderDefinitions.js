// Shared Loader Definitions
// This file contains the CSS and HTML for all preloader types
// Used by both the admin app (for demos) and the theme extension (for frontend)

export const loaderDefinitions = {
  pulseOrbit: {
    name: "Pulse Orbit",
    description: "Perfect for minimalist interfaces or elegant loading states.",
    category: "dots",
    css: `
      .sht-loader {
        --sht-size: 35px;
        --sht-color: var(--primary);
        height: var(--sht-size);
        width: var(--sht-size);
        animation: anm78236 calc(var(--speed) * 2.5) infinite linear;
      }
      .sht-loader-in {
        position: absolute;
        height: 100%;
        width: 30%;
      }
      .sht-loader-in:after {
        content: '';
        position: absolute;
        height: 12px;
        width: 12px;
        background: var(--sht-color);
        border-radius: 50%;
      }
      .sht-loader-in:nth-child(1) {
        bottom: 5%;
        left: 0;
        transform: rotate(60deg);
        transform-origin: 50% 85%;
      }
      .sht-loader-in:nth-child(1)::after {
        bottom: 0;
        left: 0;
        animation: anm78237 var(--speed) infinite calc(var(--speed) * -0.3) ease-in-out;
      }
      .sht-loader-in:nth-child(2) {
        bottom: 5%;
        right: 0;
        transform: rotate(-60deg);
        transform-origin: 50% 85%;
      }
      .sht-loader-in:nth-child(2)::after {
        bottom: 0;
        left: 0;
        animation: anm78237 var(--speed) infinite calc(var(--speed) * -0.15) ease-in-out;
      }
      .sht-loader-in:nth-child(3) {
        bottom: -5%;
        left: 0;
        transform: translateX(116.666%);
      }
      .sht-loader-in:nth-child(3)::after {
        top: 0;
        left: 0;
        animation: anm78238 var(--speed) infinite ease-in-out;
      }
      @keyframes anm78236 {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
      @keyframes anm78237 {
        0%,
          100% {
          transform: translateY(0%) scale(1);
          opacity: 1;
        }
        50% {
          transform: translateY(-66%) scale(0.65);
          opacity: .8;
        }
      }
      @keyframes anm78238 {
        0%,
          100% {
          transform: translateY(0%) scale(1);
          opacity: 1;
        }
        50% {
          transform: translateY(66%) scale(0.65);
          opacity: .8;
        }
      }
    `,
    html: `
      <div class="sht-loader">
        <div class="sht-loader-in"></div>
        <div class="sht-loader-in"></div>
        <div class="sht-loader-in"></div>
      </div>
    `
  },
  thinLionfish: {
    name: "Thin Lionfish",
    description: "Perfect for sleek portfolios or modern creative sites.",
    category: "dots",
    css: `
      .sht-loader {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }
      .sht-loader-in {
        height: 16px;
        width: 16px;
        border-radius: 50%;
        background: var(--primary);
        animation: anm29832 calc(var(--speed) * 1.5) infinite ease-in-out;
        animation-delay: -.2s;
      }
      .sht-loader-in:nth-child(2) {
        animation-delay: -.1s;
      }
      .sht-loader-in:nth-child(3) {
        animation-delay: .1s;
      }
      .sht-loader-in:nth-child(4) {
        animation-delay: .2s;
      }
      .sht-loader-in:nth-child(5) {
        animation-delay: .3s;
      }
      @keyframes anm29832 {
        0% {
          transform: scale(0.8);
          background: var(--primary);
          box-shadow: 0 0 0 0 rgba(var(--p-r), var(--p-g), var(--p-b), .7);
        }
        50% {
          transform: scale(1.2);
          background: var(--secondary);
          box-shadow: 0 0 0 10px rgba(var(--s-r), var(--s-g), var(--s-b), 0);
        }
        100% {
          transform: scale(0.8);
          background: var(--primary);
          box-shadow: 0 0 0 0 rgba(var(--p-r), var(--p-g), var(--p-b), .7);
        }
      }
    `,
    html: `
      <div class="sht-loader">
        <div class="sht-loader-in"></div>
        <div class="sht-loader-in"></div>   
        <div class="sht-loader-in"></div>
        <div class="sht-loader-in"></div>
        <div class="sht-loader-in"></div>
      </div>
    `
  },
  jollyKangaroo: {
    name: "Jolly Kangaroo",
    description: "Perfect for playful or kids-themed websites.",
    category: "dots",
    css: `
      .sht-loader {
        --sht-size: 50px;
        --sht-color: var(--primary);
        display: flex;
        align-items: center;
        justify-content: center;
        width: var(--sht-size);
        height: var(--sht-size);
      }
      .sht-loader-in {
        display: flex;
        align-items: center;
        height: 100%;
        width: 25%;
        transform-origin: center top;
      }
      .sht-loader-in::after {
        content: '';
        display: block;
        width: 100%;
        height: 25%;
        border-radius: 50%;
        background-color: var(--sht-color);
      }
      .sht-loader-in:first-child {
        animation: anm12922 var(--speed) linear infinite;
      }
      .sht-loader-in:last-child {
        animation: anm12937 var(--speed) linear infinite;
      }
      @keyframes anm12922 {
        0% {
          transform: rotate(0deg);
          animation-timing-function: ease-out;
        }
        25% {
          transform: rotate(70deg);
          animation-timing-function: ease-in;
        }
        50% {
          transform: rotate(0deg);
          animation-timing-function: linear;
        }
      }
      @keyframes anm12937 {
        0% {
          transform: rotate(0deg);
          animation-timing-function: linear;
        }
        50% {
          transform: rotate(0deg);
          animation-timing-function: ease-out;
        }
        75% {
          transform: rotate(-70deg);
          animation-timing-function: ease-in;
        }
      }
    `,
    html: `
      <div class="sht-loader">
        <div class="sht-loader-in"></div>
        <div class="sht-loader-in"></div>   
        <div class="sht-loader-in"></div>
        <div class="sht-loader-in"></div>
      </div>
    `
  },
  emberLoop: {
    name: "Ember Loop",
    description: "Perfect for tech dashboards or dark-themed apps.",
    category: "spinner",
    css: `
      .sht-loader {
        width: 36px;
        height: 36px;
        border: 4px solid var(--primary);
        border-bottom-color: var(--secondary);
        border-radius: 50%;
        animation: anm2187329 var(--speed) linear infinite;
      }
      @keyframes anm2187329 {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      } 
    `,
    html: `
      <div class="sht-loader"></div>
    `
  },
  orbitDot: {
    name: "Orbit Dot",
    description: "Perfect for clean, minimalist tech interfaces.",
    category: "spinner",
    css: `
      .sht-loader {
        --sht-size: 4px;
        width: calc(var(--sht-size) * 9);
        height: calc(var(--sht-size) * 9);
        border: 4px solid var(--secondary);
        border-radius: 50%;
        animation: anm958772 var(--speed) linear infinite;
      }
      .sht-loader::after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        background: var(--primary);
        width: calc(var(--sht-size) * 3);
        height: calc(var(--sht-size) * 3);
        transform: translate(-50%, 50%);
        border-radius: 50%;
      } 
      @keyframes anm958772 {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      } 
    `,
    html: `
      <div class="sht-loader"></div>
    `
  },
  hypnoticLoop: {
    name: "Hypnotic Loop",
    description: "Perfect for modern or clean product websites.",
    category: "spinner",
    css: `
      .sht-loader {
        --sht-size: 4px;
        width: calc(var(--sht-size) * 9);
        height: calc(var(--sht-size) * 9);
        border: 4px solid var(--secondary);
        border-radius: 50%;
        position: relative;
        animation: anm21882 var(--speed) linear infinite;
      }
      .sht-loader::after {
        content: '';
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: calc(var(--sht-size) * 6);
        height: calc(var(--sht-size) * 6);
        border: 4px solid transparent;
        border-top-color: var(--primary);
        border-radius: 50%;
        animation: anm21992 calc(var(--speed) * .5) linear infinite;
      }
      @keyframes anm21882 {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes anm21992 {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(-360deg); }
      }
    `,
    html: `
      <div class="sht-loader"></div>
    `
  },
  dualOrbit: {
    name: "Dual Orbit",
    description: "Perfect for tech websites or developer tools.",
    category: "spinner",
    css: `
      .sht-loader {
        --sht-size: 4px;
        width: calc(var(--sht-size) * 9);
        height: calc(var(--sht-size) * 9);
        border-radius: 50%;
        border: 4px solid;
        border-color: var(--secondary) var(--secondary) transparent transparent;
        animation: anm92839 var(--speed) linear infinite;
      }
      .sht-loader::after,
      .sht-loader::before {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        border: 4px solid;
        border-color: transparent transparent var(--primary) var(--primary);
        width: calc(var(--sht-size) * 7);
        height: calc(var(--sht-size) * 7);
        border-radius: 50%;
        animation: anm92832 calc(var(--speed) * .5) linear infinite;
        transform-origin: center center;
      }
      .sht-loader::before {
        width: calc(var(--sht-size) * 5);
        height: calc(var(--sht-size) * 5);
        border-color: var(--secondary) var(--secondary) transparent transparent;
        animation: anm92839 calc(var(--speed) * 1.5) linear infinite;
      }
          
      @keyframes anm92839 {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      } 
      @keyframes anm92832 {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(-360deg);
        }
      }
          
    `,
    html: `
      <div class="sht-loader"></div>
    `
  },
  arcMotion: {
    name: "Arc Motion",
    description: "Perfect for creative tech or motion-driven websites.",
    category: "spinner",
    css: `
      .sht-loader {
        transform: rotateZ(45deg);
        width: 36px;
        height: 36px;
        color: var(--secondary);
      }
      .sht-loader:before,
      .sht-loader:after {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: inherit;
        height: inherit;
        border-radius: 50%;
        transform: rotateX(70deg);
        animation: var(--speed) spin linear infinite;
      }
      .sht-loader:after {
        color: var(--primary);
        transform: rotateY(70deg);
        animation-delay: .4s;
      }
      @keyframes spin {
        0%,
        100% {
          box-shadow: .4em 0px 0 0px currentcolor;
        }
        12% {
          box-shadow: .4em .4em 0 0 currentcolor;
        }
        25% {
          box-shadow: 0 .4em 0 0px currentcolor;
        }
        37% {
          box-shadow: -.4em .4em 0 0 currentcolor;
        }
        50% {
          box-shadow: -.4em 0 0 0 currentcolor;
        }
        62% {
          box-shadow: -.4em -.4em 0 0 currentcolor;
        }
        75% {
          box-shadow: 0px -.4em 0 0 currentcolor;
        }
        87% {
          box-shadow: .4em -.4em 0 0 currentcolor;
        }
      }        
    `,
    html: `
      <div class="sht-loader"></div>
    `
  },
  jumpingSquare: {
    name: "Jumping Square",
    description: "Perfect for clean blogs or elegant pet brand sites.",
    category: "square",
    css: `
      .sht-loader {
        width: 36px;
        height: 36px;
        margin: auto;
        position: relative;
      }
      .sht-loader:before {
        content: '';
        width: 36px;
        height: 5px;
        background: rgba(var(--p-r), var(--p-g), var(--p-b), .31);
        position: absolute;
        top: 52px;
        left: 0;
        border-radius: 50%;
        animation: anm78291 calc(var(--speed) * .6) linear infinite;
      }
      .sht-loader:after {
        content: '';
        width: 100%;
        height: 100%;
        background: var(--primary);
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 4px;
        animation: anm92392 calc(var(--speed) * .6) linear infinite;
      }
      @keyframes anm92392 {
        15% {
          border-bottom-right-radius: 3px;
        }
        25% {
          transform: translateY(9px) rotate(22.5deg);
        }
        50% {
          transform: translateY(18px) scale(1, .9) rotate(45deg);
          border-bottom-right-radius: 40px;
        }
        75% {
          transform: translateY(9px) rotate(67.5deg);
        }
        100% {
          transform: translateY(0) rotate(90deg);
        }
      }
      @keyframes anm78291 {
        0%,
          100% {
          transform: scale(1, 1);
        }
        50% {
          transform: scale(1.2, 1);
        }
      }   
    `,
    html: `
      <div class="sht-loader"></div>
    `
  },
  dualFrame: {
    name: "Dual Frame",
    description: "Fits branding with precision and harmony.",
    category: "square",
    css: `
      .sht-loader {
        --sht-size: 36px;
        width: var(--sht-size);
        height: var(--sht-size);
        position: relative;
      }
      .sht-loader::after,
      .sht-loader::before {
        content: '';
        width: var(--sht-size);
        height: var(--sht-size);
        border: 4px solid var(--secondary);
        position: absolute;
        left: 0;
        top: 0;
        animation: anm728826 var(--speed) ease-in-out infinite;
        animation-delay: calc(var(--speed) * 1);
      }
      .sht-loader::after {
        border-color: var(--primary);
        animation-delay: calc(var(--speed) * 1.2);
      }
      @keyframes anm728826 {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      } 
    `,
    html: `
      <div class="sht-loader"></div>
    `
  },
  riseBlock: {
    name: "Rise Block",
    description: "Perfect for minimal websites or elegant brands.",
    category: "square",
    css: `
      .sht-loader {
        width: 36px;
        height: 36px;
        color: var(--primary);
        border: 2px solid var(--secondary);
        animation: anm727692 var(--speed) linear infinite alternate;
      }
      @keyframes anm727692 {
        0% {
          box-shadow: 0 0  inset;
        }
        100% {
          box-shadow: 0 -36px inset;
        }
      }
    `,
    html: `
      <div class="sht-loader"></div>
    `
  },
  urbanDrive: {
    name: "Urban Drive",
    description: "Perfect for delivery apps or logistics dashboards.",
    category: "graphic",
    css: `
      .truckWrapper {
        width: 200px;
        height: 100px;
        display: flex;
        flex-direction: column;
        position: relative;
        align-items: center;
        justify-content: flex-end;
        overflow-x: hidden;
      }
      .truckBody {
        width: 130px;
        margin-bottom: 6px;
        animation: anm27130 1s linear infinite;
      }
      @keyframes anm27130 {
        0% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(3px);
        }
        100% {
          transform: translateY(0px);
        }
      }
      .truckTires {
        width: 130px;
        height: fit-content;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 10px 0 15px;
        position: absolute;
        bottom: 0;
      }
      .truckTires svg {
        width: 24px;
      }
      .road {
        width: 100%;
        height: 1.5px;
        background: #282828;
        border-radius: 3px;
      }
      .road::before,
      .road::after {
        content: "";
        position: absolute;
        height: 100%;
        background: #282828;
        border-radius: 3px;
        animation: anm928398 calc(var(--speed) * 2) linear infinite;
      }
      .road::before {
        width: 20px;
        right: -50%;
        border-left: 10px solid white;
      }
      .road::after {
        width: 10px;
        right: -65%;
        border-left: 4px solid white;
      }
      .lamp {
        position: absolute;
        bottom: 0;
        right: -90%;
        height: 90px;
        animation: anm928398 calc(var(--speed) * 2) linear infinite;
      }
      @keyframes anm928398 {
        0% {
          transform: translateX(0px);
        }
        100% {
          transform: translateX(-350px);
        }
      }
    `,
    html: `
      <div class="sht-loader">
        <div class="truckWrapper">
          <div class="truckBody">
            <svg
              fill="none"
              viewBox="0 0 198 93"
            >
              <path
                stroke-width="3"
                stroke="#282828"
                fill="var(--primary)"
                d="M135 22.5H177.264C178.295 22.5 179.22 23.133 179.594 24.0939L192.33 56.8443C192.442 57.1332 192.5 57.4404 192.5 57.7504V89C192.5 90.3807 191.381 91.5 190 91.5H135C133.619 91.5 132.5 90.3807 132.5 89V25C132.5 23.6193 133.619 22.5 135 22.5Z"
              ></path>
              <path
                stroke-width="3"
                stroke="#282828"
                fill="#7D7C7C"
                d="M146 33.5H181.741C182.779 33.5 183.709 34.1415 184.078 35.112L190.538 52.112C191.16 53.748 189.951 55.5 188.201 55.5H146C144.619 55.5 143.5 54.3807 143.5 53V36C143.5 34.6193 144.619 33.5 146 33.5Z"
              ></path>
              <path
                stroke-width="2"
                stroke="#282828"
                fill="#282828"
                d="M150 65C150 65.39 149.763 65.8656 149.127 66.2893C148.499 66.7083 147.573 67 146.5 67C145.427 67 144.501 66.7083 143.873 66.2893C143.237 65.8656 143 65.39 143 65C143 64.61 143.237 64.1344 143.873 63.7107C144.501 63.2917 145.427 63 146.5 63C147.573 63 148.499 63.2917 149.127 63.7107C149.763 64.1344 150 64.61 150 65Z"
              ></path>
              <rect
                stroke-width="2"
                stroke="#282828"
                fill="#FFFCAB"
                rx="1"
                height="7"
                width="5"
                y="63"
                x="187"
              ></rect>
              <rect
                stroke-width="2"
                stroke="#282828"
                fill="#282828"
                rx="1"
                height="11"
                width="4"
                y="81"
                x="193"
              ></rect>
              <rect
                stroke-width="3"
                stroke="#282828"
                fill="var(--secondary)"
                rx="2.5"
                height="90"
                width="121"
                y="1.5"
                x="6.5"
              ></rect>
              <rect
                stroke-width="2"
                stroke="#282828"
                fill="var(--secondary)"
                rx="2"
                height="4"
                width="6"
                y="84"
                x="1"
              ></rect>
            </svg>
          </div>
          <div class="truckTires">
            <svg
              fill="none"
              viewBox="0 0 30 30"
            >
              <circle
                stroke-width="3"
                stroke="#282828"
                fill="#282828"
                r="13.5"
                cy="15"
                cx="15"
              ></circle>
              <circle fill="#DFDFDF" r="7" cy="15" cx="15"></circle>
            </svg>
            <svg
              fill="none"
              viewBox="0 0 30 30"
            >
              <circle
                stroke-width="3"
                stroke="#282828"
                fill="#282828"
                r="13.5"
                cy="15"
                cx="15"
              ></circle>
              <circle fill="#DFDFDF" r="7" cy="15" cx="15"></circle>
            </svg>
          </div>
          <div class="road"></div>

          <svg
            viewBox="0 0 453.459 453.459"
            id="Capa_1"
            version="1.1"
            fill="#000000"
            class="lamp"
          >
            <path
              d="M252.882,0c-37.781,0-68.686,29.953-70.245,67.358h-6.917v8.954c-26.109,2.163-45.463,10.011-45.463,19.366h9.993
      c-1.65,5.146-2.507,10.54-2.507,16.017c0,28.956,23.558,52.514,52.514,52.514c28.956,0,52.514-23.558,52.514-52.514
      c0-5.478-0.856-10.872-2.506-16.017h9.992c0-9.354-19.352-17.204-45.463-19.366v-8.954h-6.149C200.189,38.779,223.924,16,252.882,16
      c29.952,0,54.32,24.368,54.32,54.32c0,28.774-11.078,37.009-25.105,47.437c-17.444,12.968-37.216,27.667-37.216,78.884v113.914
      h-0.797c-5.068,0-9.174,4.108-9.174,9.177c0,2.844,1.293,5.383,3.321,7.066c-3.432,27.933-26.851,95.744-8.226,115.459v11.202h45.75
      v-11.202c18.625-19.715-4.794-87.527-8.227-115.459c2.029-1.683,3.322-4.223,3.322-7.066c0-5.068-4.107-9.177-9.176-9.177h-0.795
      V196.641c0-43.174,14.942-54.283,30.762-66.043c14.793-10.997,31.559-23.461,31.559-60.277C323.202,31.545,291.656,0,252.882,0z
      M232.77,111.694c0,23.442-19.071,42.514-42.514,42.514c-23.442,0-42.514-19.072-42.514-42.514c0-5.531,1.078-10.957,3.141-16.017
      h78.747C231.693,100.736,232.77,106.162,232.77,111.694z"
            ></path>
          </svg>
        </div>
      </div>
    `
  },
  tameFly: {
    name: "Tame Fly",
    description: "Perfect for any website that needs to show a loading state.",
    category: "dots",
    css: `
      .sht-loader {
        position: relative;
        width: 120px;
        height: 90px;
        margin: 0 auto;
      }
      .sht-loader:before {
        content: "";
        position: absolute;
        bottom: 30px;
        left: 50px;
        height: 30px;
        width: 30px;
        border-radius: 50%;
        background: var(--primary);
        animation: loading-bounce calc(var(--speed) * .5) ease-in-out infinite alternate;
      }
      .sht-loader:after {
        content: "";
        position: absolute;
        right: 0;
        top: 0;
        height: 7px;
        width: 45px;
        border-radius: 4px;
        box-shadow: 0 5px 0 var(--secondary), -35px 50px 0 var(--secondary), -70px 95px 0 var(--secondary);
        animation: loading-step calc(var(--speed) * 1) ease-in-out infinite;
      }
      @keyframes loading-bounce {
        0% {
          transform: scale(1, 0.7);
        }
        40% {
          transform: scale(0.8, 1.2);
        }
        60% {
          transform: scale(1, 1);
        }
        100% {
          bottom: 140px;
        }
      }
      @keyframes loading-step {
        0% {
          box-shadow: 0 10px 0 rgba(0, 0, 0, 0),
                  0 10px 0 var(--secondary),
                  -35px 50px 0 var(--secondary),
                  -70px 90px 0 var(--secondary);
        }
        100% {
          box-shadow: 0 10px 0 var(--secondary),
                  -35px 50px 0 var(--secondary),
                  -70px 90px 0 var(--secondary),
                  -70px 90px 0 rgba(0, 0, 0, 0);
        }
      }
    `,
    html: `
      <div class="sht-loader"></div>
    `
  },
  loadingBar: {
    name: "Loading Bar",
    description: "Perfect for any website that needs to show a loading state.",
    category: "bars",
    css: `
      .sht-loader {
        width: 130px;
        height: 4px;
        border-radius: 30px;
        background: var(--secondary);
        position: relative;
      }
      .sht-loader::before {
        content: "";
        position: absolute;
        background: var(--primary);
        top: 0;
        left: 0;
        width: 0%;
        height: 100%;
        border-radius: 30px;
        animation: anm98292 var(--speed) ease-in-out infinite;
      }
      @keyframes anm98292 {
        50% {
          width: 100%;
        }
        100% {
          width: 0;
          right: 0;
          left: unset;
        }
      }
    `,
    html: `
      <div class="sht-loader"></div>
    `
  },
  spectrumPulse: {
    name: "Spectrum Pulse",
    description: "Perfect for music apps or live activity indicators.",
    category: "bars",
    css: `
      .sht-loader {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100px;
        gap: 6px;
        height: 100px;
      }
      .sht-loader span {
        width: 4px;
        height: 50px;
        background: var(--primary);
        animation: scale calc(var(--speed) * 1.5) ease-in-out infinite;
        animation-delay: -0.9s;
      }
      .sht-loader span:nth-child(2) {
        background: rgba(var(--p-r), var(--p-g), var(--p-b), 0.6);
        animation-delay: -0.8s;
      }
      .sht-loader span:nth-child(3) {
        background: var(--secondary);
        animation-delay: -0.7s;
      }
      .sht-loader span:nth-child(4) {
        background: rgba(var(--s-r), var(--s-g), var(--s-b), 0.6);
        animation-delay: -0.6s;
      }
      .sht-loader span:nth-child(5) {
        background: var(--primary);
        animation-delay: -0.5s;
      }
      @keyframes scale {
        0%, 40%, 100% {
          transform: scaleY(0.05);
        }
        20% {
          transform: scaleY(1);
        }
      }
    `,
    html: `
      <div class="sht-loader">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    `
  },
};

// Helper function to get loader config for admin app
export const getLoaderConfig = (type) => {
  const loader = loaderDefinitions[type];
  if (!loader) return null;
  
  return {
    name: loader.name,
    description: loader.description,
    category: loader.category,
    preview: type
  };
};

// Helper function to get all loaders for admin app
export const getAllLoaderConfigs = () => {
  return Object.entries(loaderDefinitions).map(([key, config]) => [
    key,
    getLoaderConfig(key)
  ]);
};

// Helper function to get categories
export const getCategories = () => {
  return {
    "all": {
      "name": "All",
      "description": "Show all preloader types"
    },
    "dots": {
      "name": "Dots",
      "description": "Traditional loading animations"
    },
    "spinner": {
      "name": "Spinner",
      "description": "Contemporary loading animations"
    },
    "square": {
      "name": "Square",
      "description": "Contemporary loading animations"
    },
    "graphic": {
      "name": "Graphic",
      "description": "Contemporary loading animations"
    },
    "bars": {
      "name": "Bars",
      "description": "Contemporary loading animations"
    }
  };
};
