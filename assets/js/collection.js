
(function () {
  async function main() {
    var API_KEY = "key_Wl31DW52SembqpV7";
    var BASE_URL = "https://ac.cnstrc.com";

    var clientId = localStorage.getItem("cio_client_id");
    if (!clientId) {
      clientId = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Math.random()).slice(2);
      localStorage.setItem("cio_client_id", clientId);
    }

    var sessionId = sessionStorage.getItem("cio_session_id");
    if (!sessionId) {
      sessionId = String(Date.now());
      sessionStorage.setItem("cio_session_id", sessionId);
    }

    function buildUrl(path, params) {
      var url = new URL(BASE_URL + path);
      url.searchParams.set("key", API_KEY);
      url.searchParams.set("i", clientId);
      url.searchParams.set("s", String(sessionId));

      if (params) {
        Object.keys(params).forEach(function (k) {
          var v = params[k];
          if (v === undefined || v === null) return;
          url.searchParams.set(k, (typeof v === "object") ? JSON.stringify(v) : String(v));
        });
      }
      return url.toString();
    }

    async function fetchJsonOrThrow(url) {
      var res = await fetch(url, { credentials: "omit" });
      var text = await res.text();

      if (!res.ok) {
        console.error("Constructor error status:", res.status);
        console.error("Constructor error body:", text);
        throw new Error("Request failed: " + res.status);
      }

      return JSON.parse(text);
    }

    async function getBrowseResultsByCollectionId(collectionId, opts) {
      opts = opts || {};
      var section = opts.section || "Products";
      var page = opts.page || 1;
      var sortBy = opts.sortBy || "relevance";
      var sortOrder = opts.sortOrder || "descending";
      var numResults = opts.num_results_per_page || 50;

      var url = buildUrl("/browse/collection_id/" + encodeURIComponent(collectionId), {
        section: section,
        page: page,
        sort_by: sortBy,
        sort_order: sortOrder,
        num_results_per_page: numResults
      });

      return fetchJsonOrThrow(url);
    }

    function sanitizeImageUrl(url) {
      if (!url) return "";
      return url.indexOf("?") !== -1 ? url.split("?")[0] : url;
    }

    function extractFacetMinPrice(payload) {
      var response = payload && payload.response;
      var facets = response && response.facets;
      if (!Array.isArray(facets)) return null;

      for (var i = 0; i < facets.length; i++) {
        if (facets[i] && facets[i].name === "price") {
          var min = facets[i].min;
          return Number.isFinite(min) ? min : null;
        }
      }
      return null;
    }

    function extractProductNumbers(item) {
      var data = item && item.data;
      var price = data ? data.price : null;
      var fromPrice = data ? data.fromPrice : null;
      var saveAmount = data ? data.saveAmount : null;

      return {
        price: Number.isFinite(price) ? price : null,
        fromPrice: Number.isFinite(fromPrice) ? fromPrice : null,
        saveAmount: Number.isFinite(saveAmount) ? saveAmount : null
      };
    }

    function clean(str) {
      str = str || "";
      return str.replace(/\/+$/, "").replace(/^\/+/, "");
    }

    function buildFinalUrl(item) {
      var data = item && item.data;
      if (!data) return "#";

      var rawUrl = data.url || "";
      var primaryCategoryPath = data.primaryCategoryPath || "";

      var relativeUrl = rawUrl.replace(/^https?:\/\/www\.plaisio\.gr\/?/, "");

      return [
        "https://www.plaisio.gr/product",
        clean(primaryCategoryPath),
        clean(relativeUrl)
      ].join("/");
    }

    function renderResults(gridEl, payload, staticCard) {
      var tpl = document.getElementById("product-card-template");
      if (!tpl) throw new Error("Missing <template id='product-card-template'>");

      var response = payload && payload.response;
      var results = (response && response.results) ? response.results : (payload && payload.results ? payload.results : []);

      var minPrice = extractFacetMinPrice(payload);
      var minEl = gridEl.querySelector(".collection-min-price");
      if (minEl) minEl.textContent = (minPrice != null) ? ("Από " + minPrice + "€") : "";

      var cardsEl = gridEl.querySelector(".cards");
      if (!cardsEl) throw new Error("Missing .cards inside .product-grid");

      cardsEl.innerHTML = "";
      var frag = document.createDocumentFragment();

      for (var r = 0; r < results.length; r++) {
        var item = results[r];

        var name = (item && item.value) ||
                   (item && item.data && (item.data.name || item.data.productName)) ||
                   "";

        var finalUrl = buildFinalUrl(item);

        var images = (item && item.data && item.data.productImages) || [];
        var imageUrl  = (images[0] || "").split("?")[0];
        var imageUrl2 = (images[1] || "").split("?")[0];

        if (!imageUrl) imageUrl = sanitizeImageUrl(item && item.data ? item.data.image_url : "");

        var nums = extractProductNumbers(item);
        var price = nums.price, fromPrice = nums.fromPrice, saveAmount = nums.saveAmount;

        var card = tpl.content.firstElementChild.cloneNode(true);

        var id = (item && item.data && item.data.id) || (item && item.id);
        if (id != null) card.dataset.product = String(id);

        var allLinks = card.querySelectorAll("a");
        for (var l = 0; l < allLinks.length; l++) {
          allLinks[l].href = finalUrl;
        }

        var img = card.querySelector(".product-image");
        if (img) {
          img.src = imageUrl;
          img.alt = name || "Product";

          if (imageUrl2) {
            var preload = new Image();
            preload.src = imageUrl2;

            (function (imgEl, url1, url2) {
              imgEl.addEventListener("mouseenter", function () { imgEl.src = url2; });
              imgEl.addEventListener("mouseleave", function () { imgEl.src = url1; });
            })(img, imageUrl, imageUrl2);
          }
        }

        var titleEl = card.querySelector(".title");
        if (titleEl) titleEl.textContent = name;

        // var priceEl = card.querySelector(".price");
        // if (priceEl) priceEl.textContent = (price != null) ? (price + "€") : "";

        var fromEl = card.querySelector(".from-price");
        if (fromEl) {
          var showFrom = (fromPrice != null) && (price == null || fromPrice > price);
          fromEl.textContent = showFrom ? ("Από: " + fromPrice + "€") : "";
        }

        var saveEl = card.querySelector(".save-amount");
        if (saveEl) {
          saveEl.textContent = (saveAmount != null && saveAmount > 0) ? ("Κερδίζεις: " + saveAmount + "€") : "";
        }

        frag.appendChild(card);
      }

      cardsEl.appendChild(frag);

      // Re-append static card at the end
      if (staticCard) cardsEl.appendChild(staticCard);
    }

    var grids = document.querySelectorAll(".product-grid");

    for (var g = 0; g < grids.length; g++) {
      var grid = grids[g];
      var collectionId = grid.getAttribute("data-collection-id");
      if (!collectionId) continue;

      var page = Number(grid.getAttribute("data-page") || 1);
      var section = grid.getAttribute("data-section") || "Products";
      var sortBy = grid.getAttribute("data-sort-by") || "relevance";
      var sortOrder = grid.getAttribute("data-sort-order") || "descending";

      var fallback = grid.querySelector(".fallback");
      if (fallback) fallback.classList.remove("visible");

      var cardsEl = grid.querySelector(".cards");

      // Detach static card before anything wipes cardsEl
      var staticCard = cardsEl ? cardsEl.querySelector(".static-card") : null;
      if (staticCard) staticCard.remove();

      if (cardsEl) cardsEl.textContent = "Loading…";

      try {
        var payload = await getBrowseResultsByCollectionId(collectionId, {
          page: page,
          section: section,
          sortBy: sortBy,
          sortOrder: sortOrder
        });

        var hasResults = payload && payload.response && payload.response.results && payload.response.results.length;
        if (!hasResults) {
          if (fallback) fallback.classList.add("visible");
          if (cardsEl) cardsEl.textContent = "";
          if (staticCard && cardsEl) cardsEl.appendChild(staticCard);
          continue;
        }

        renderResults(grid, payload, staticCard);
      } catch (err) {
        console.error("Collection load failed:", err);
        if (fallback) fallback.classList.add("visible");
        if (cardsEl) cardsEl.textContent = "";
        if (staticCard && cardsEl) cardsEl.appendChild(staticCard);
      }
    }
  }

  main();
})();