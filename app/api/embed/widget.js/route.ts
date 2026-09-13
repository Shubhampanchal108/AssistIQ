import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin || "http://localhost:3000";
  const { searchParams } = req.nextUrl;
  const botId = searchParams.get("botId") || "bot_default";

  const jsCode = `
(function() {
  if (window.__SUPPORT_BOT_EMBEDDED__) return;
  window.__SUPPORT_BOT_EMBEDDED__ = true;

  // Determine Bot ID from script data attribute or URL param
  var currentScript = document.currentScript || (function() {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  var targetBotId = "${botId}";
  if (currentScript && currentScript.getAttribute('data-bot-id')) {
    targetBotId = currentScript.getAttribute('data-bot-id');
  }

  var baseUrl = "${origin}";
  var isOpen = false;

  // Create Styles
  var style = document.createElement('style');
  style.innerHTML = \`
    .sb-widget-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
    .sb-widget-button {
      width: 60px;
      height: 60px;
      border-radius: 30px;
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      border: 2px solid rgba(255, 255, 255, 0.2);
      outline: none;
      position: relative;
    }
    .sb-widget-button:hover {
      transform: scale(1.08) translateY(-2px);
      box-shadow: 0 15px 30px -5px rgba(79, 70, 229, 0.6), 0 10px 12px -6px rgba(0, 0, 0, 0.4);
    }
    .sb-widget-button:active {
      transform: scale(0.95);
    }
    .sb-widget-button svg {
      width: 28px;
      height: 28px;
      fill: none;
      stroke: #ffffff;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
      transition: transform 0.3s ease;
    }
    .sb-widget-badge {
      position: absolute;
      top: -2px;
      right: -2px;
      width: 14px;
      height: 14px;
      background-color: #10b981;
      border: 2px solid #ffffff;
      border-radius: 50%;
    }
    .sb-widget-iframe-container {
      width: 410px;
      height: 650px;
      max-width: calc(100vw - 32px);
      max-height: calc(100vh - 100px);
      margin-bottom: 16px;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.15);
      transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      opacity: 0;
      visibility: hidden;
      transform: translateY(20px) scale(0.95);
      transform-origin: bottom right;
      background-color: #0A0A0E;
    }
    .sb-widget-iframe-container.sb-open {
      opacity: 1;
      visibility: visible;
      transform: translateY(0) scale(1);
    }
    .sb-widget-iframe {
      width: 100%;
      height: 100%;
      border: none;
      background: transparent;
    }
  \`;
  document.head.appendChild(style);

  // Create Container
  var container = document.createElement('div');
  container.className = 'sb-widget-container';

  // Create Iframe Container
  var iframeBox = document.createElement('div');
  iframeBox.className = 'sb-widget-iframe-container';

  var iframe = document.createElement('iframe');
  iframe.className = 'sb-widget-iframe';
  iframe.src = baseUrl + '/embed/chat?botId=' + encodeURIComponent(targetBotId);
  iframeBox.appendChild(iframe);

  // Create Button
  var button = document.createElement('button');
  button.className = 'sb-widget-button';
  button.setAttribute('aria-label', 'Open Customer Support Chat');

  var badge = document.createElement('div');
  badge.className = 'sb-widget-badge';
  button.appendChild(badge);

  // Chat SVG Icon
  var chatIconHtml = '<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
  var closeIconHtml = '<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';

  button.innerHTML = chatIconHtml + '<div class="sb-widget-badge"></div>';

  function toggleWidget() {
    isOpen = !isOpen;
    if (isOpen) {
      iframeBox.classList.add('sb-open');
      button.innerHTML = closeIconHtml;
    } else {
      iframeBox.classList.remove('sb-open');
      button.innerHTML = chatIconHtml + '<div class="sb-widget-badge"></div>';
    }
  }

  button.addEventListener('click', toggleWidget);

  // Listen for iframe close events
  window.addEventListener('message', function(event) {
    if (event.data === 'sb-close-widget') {
      if (isOpen) toggleWidget();
    }
  });

  container.appendChild(iframeBox);
  container.appendChild(button);

  if (document.body) {
    document.body.appendChild(container);
  } else {
    window.addEventListener('DOMContentLoaded', function() {
      document.body.appendChild(container);
    });
  }
})();
  `;

  return new NextResponse(jsCode, {
    status: 200,
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=60",
    },
  });
}
