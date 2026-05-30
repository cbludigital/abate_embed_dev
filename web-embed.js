function initializeEmbed() {
  const c = document.querySelector('.buktor-container');
  if (!c) {
    console.log('Can\'t access embed container');
    return;
  }

  if (c.dataset.buktorMounted === "1") return;
  c.dataset.buktorMounted = "1";

  const s = c.getAttribute("data-slug");
  if (!s || s.length <= 1) {
    console.log('Error in embed code - invalid slug');
    return;
  }

  // 1. Get attributes (default to empty string if null)
  const attrs = {
    domainUrl: c.getAttribute('data-url'),
    otp: c.getAttribute("data-otp-required"),
    location: c.getAttribute("data-location"),
    category: c.getAttribute("data-category"),
    service: c.getAttribute("data-service"),
    dateView: c.getAttribute("data-date-view"),
  }

  c.style.cssText = 'width:100%;min-height:400px;border:none;background:none transparent;position:relative;left:0;top:0;';
  
  // Create Loader
  const loader = document.createElement('div');
  loader.style.cssText = 'width:100%;height:100%;position:absolute;left:0;top:0;padding:0;z-index:980;background-color:white;display:flex;justify-content:center;align-items:center;';
  loader.innerHTML = `
    <div style="text-align:center;">
      <p style="margin-bottom:10px;">Getting your booking ready…</p>
      <div style="margin:auto;width:30px;height:30px;border:4px solid #ccc;border-top:4px solid #007bff;border-radius:50%;animation:spin 1s linear infinite;"></div>
    </div>
    <style>
      @keyframes spin { 100% { transform: rotate(360deg); } }
    </style>`;
  c.appendChild(loader);

  // 2. ONLY build search params for values that are NOT null or empty
  const searchParams = new URLSearchParams();
  if (attrs.otp) searchParams.set('data-otp-required', attrs.otp);
  if (attrs.location) searchParams.set('data-location', attrs.location);
  if (attrs.category) searchParams.set('data-category', attrs.category);
  if (attrs.service) searchParams.set('data-service', attrs.service);
  if (attrs.dateView) searchParams.set('data-date-view', attrs.dateView);

  // 3. Build correct iframe URL
  const iframe = document.createElement('iframe');
  iframe.src = `${attrs.domainUrl}/${s}/script-ui/web-embed?${searchParams.toString()}`;

  iframe.style.cssText = 'z-index:910; height: 80vh; width:100%; border:none;';
  iframe.setAttribute('allowtransparency', 'true');
  
  iframe.onload = function() {
    c.removeChild(loader);
  };
  c.appendChild(iframe);

  const messageHandler = (ev) => {
    if (!ev.data || typeof ev.data !== "object") return;
    
    const eventType = ev.data.type;
    if (eventType === 'Success' || eventType === 'Failed') {
      document.dispatchEvent(new CustomEvent(eventType, { detail: ev.data.detail }));
    }
  };

  window.addEventListener("message", messageHandler);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeEmbed);
} else {
  initializeEmbed();
}
