// if (!window.buktorEmbedInitialized) {
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
  
    const attrs= {
      domainUrl: c.getAttribute('data-url'),
      otp: c.getAttribute("data-otp-required"),
      location: c.getAttribute("data-location"),
      category: c.getAttribute("data-category"),
      service: c.getAttribute("data-service"),
      dateView: c.getAttribute("data-date-view"),
      // dataConsultationType: c.getAttribute("data-consultation-type"),
    }
  
      c.style.cssText = 'width:100%;min-height:400px;border:none;background:none transparent;position:relative;left:0;top:0;';
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
  
    const iframe = document.createElement('iframe');
    const widgetUrl = `https://cbludigital.github.io/abate_embed_dev`;
    iframe.src = `${widgetUrl}?slug=${s}&${new URLSearchParams({
      'data-otp-required': attrs.otp,
      'data-location': attrs.location,
      'data-category': attrs.category,
      'data-service': attrs.service,
      'data-date-view': attrs.dateView,
    }).toString()}`;
  
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
//  window.initializeEmbed = initializeEmbed;
// }
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeEmbed);
} else {
  initializeEmbed();
}
