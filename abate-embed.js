function initializeEmbed() {
  const c = document.querySelector('.buktor-container');
  if (!c) {
    console.log('Can\'t access embed container');
    return;
  }

  const s = c.getAttribute("data-slug");
  if (!s || s.length <= 1) {
    console.log('Error in embed code - invalid slug');
    return;
  }

  // 1. Get raw attributes from the container
  const rawAttrs = {
    'data-otp-required': c.getAttribute("data-otp-required"),
    'data-location': c.getAttribute("data-location"),
    'data-category': c.getAttribute("data-category"),
    'data-service': c.getAttribute("data-service"),
    'data-date-view': c.getAttribute("data-date-view"),
    'data-booking-date': c.getAttribute("data-booking-date"),
    'data-patient-mrno': c.getAttribute("data-patient-mrno"),
    'data-patient-name': c.getAttribute("data-patient-name"),
    'data-patient-age': c.getAttribute("data-patient-age"),
    'data-patient-phone': c.getAttribute("data-patient-phone"),
    'data-appointment-id': c.getAttribute("data-appointment-id"),
    'data-base-url': c.getAttribute("data-base-url"),
    'data-appointment-callback-id': c.getAttribute("data-appointment-callback-id"),
    'data-appointment-details-button': c.getAttribute("data-appointment-details-button")
  };

  const domainUrl = c.getAttribute("data-url");

  // Set container styles
  c.style.cssText = 'width:100%;min-height:400px;border:none;background:none transparent;position:relative;left:0;top:0;';

  // Create loading indicator
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

  // 2. Safely filter out empty strings, "null", and "undefined" strings
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(rawAttrs)) {
    if (value !== null && value !== undefined && value !== "" && value !== "null" && value !== "undefined") {
      searchParams.set(key, value);
    }
  }

  // 3. Build dynamic iframe URL safely
  const iframe = document.createElement('iframe');
  iframe.src = `${domainUrl}/${s}/script-ui/abate-embed?${searchParams.toString()}`;
  
  iframe.style.cssText = 'z-index:910; height: 80vh; width:100%; border:none;';
  iframe.setAttribute('allowtransparency', 'true');
  iframe.onload = function() {
    c.removeChild(loader);
  };
  c.appendChild(iframe);

  // Message event listener
  const messageHandler = (ev) => {
    if (!ev.data || typeof ev.data !== "object") return;
    
    const eventType = ev.data.type;
    if (eventType === 'Success' || eventType === 'Failed') {
      document.dispatchEvent(new CustomEvent(eventType, { detail: ev.data.detail }));
    } else if (eventType === 'Updated') {
      document.dispatchEvent(new CustomEvent(eventType));
    }
  };
  
  window.addEventListener("message", messageHandler);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeEmbed);
} else {
  initializeEmbed();
}
