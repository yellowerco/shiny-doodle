    (function () {
      const cards = Array.from(document.querySelectorAll('.card-plan'));
      const dots = Array.from(document.querySelectorAll('.dot'));
      let order = [0, 1, 2]; // order[0] = frontmost plan index
      let animating = false;

      function offsetFor(depth) {
        return {
          x: depth * 14,
          y: depth * 16,
          scale: 1 - depth * 0.045,
          rot: depth === 0 ? 0 : (depth % 2 === 0 ? -2.5 : 2.5)
        };
      }

      function render() {
        order.forEach((planId, depth) => {
          const card = cards[planId];
          const o = offsetFor(depth);
          card.style.zIndex = 40 - depth;
          card.style.transform = `translate(${o.x}px, ${o.y}px) scale(${o.scale}) rotate(${o.rot}deg)`;
          card.style.opacity = 1;
          card.classList.toggle('is-front', depth === 0);
        });
        dots.forEach(dot => {
          dot.classList.toggle('active', parseInt(dot.dataset.plan, 10) === order[0]);
        });
      }

      function sendFrontToBack() {
        if (animating) return;
        animating = true;
        const frontId = order[0];
        const frontCard = cards[frontId];

        frontCard.classList.add('flying');
        frontCard.style.transform = `translate(-40px, 340px) rotate(-14deg)`;
        frontCard.style.opacity = '0';

        setTimeout(() => {
          order.push(order.shift());
          frontCard.classList.add('no-anim');
          frontCard.classList.remove('flying');
          const backDepth = order.indexOf(frontId);
          const o = offsetFor(backDepth);
          frontCard.style.transform = `translate(${o.x}px, ${o.y}px) scale(${o.scale}) rotate(${o.rot}deg)`;
          frontCard.style.opacity = '1';
          frontCard.style.zIndex = 40 - backDepth;
          void frontCard.offsetWidth;
          frontCard.classList.remove('no-anim');
          render();
          animating = false;
        }, 520);
      }

      function jumpTo(planId) {
        if (animating || order[0] === planId) return;
        order = [planId, ...order.filter(id => id !== planId)];
        render();
      }

      cards.forEach(card => {
        card.addEventListener('click', (e) => {
          if (e.target.closest('.card-cta')) return;
          if (card.classList.contains('is-front')) sendFrontToBack();
        });
      });

      dots.forEach(dot => {
        dot.addEventListener('click', () => jumpTo(parseInt(dot.dataset.plan, 10)));
      });

      render();

      // ---------- PROMO CODE ----------
      const PROMO_CODE = 'SOYYELLOVER';
      const promoForm = document.getElementById('promoForm');
      const promoInput = document.getElementById('promoInput');
      const promoMsg = document.getElementById('promoMsg');
      let discountApplied = false;

      function applyDiscount() {
        if (discountApplied) return;
        discountApplied = true;
        cards.forEach(card => {
          const regular = card.dataset.regular;
          const preferential = card.dataset.preferential;
          const priceOld = card.querySelector('.price-old');
          const price = card.querySelector('.price');
          const badge = card.querySelector('.discount-badge');
          priceOld.textContent = regular;
          price.textContent = preferential;
          priceOld.classList.add('show');
          badge.classList.add('show');
        });
        promoMsg.textContent = '✳ Código aplicado — precios preferenciales activos.';
        promoMsg.className = 'promo-msg ok';
        promoInput.value = 'SOYYELLOVER ✓';
        promoInput.disabled = true;
      }

      promoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (discountApplied) return;
        const value = promoInput.value.trim().toUpperCase().replace(/\s+/g, '');
        if (value === PROMO_CODE) {
          applyDiscount();
        } else {
          promoMsg.textContent = 'Código no válido. Intenta de nuevo.';
          promoMsg.className = 'promo-msg err';
          promoInput.classList.remove('shake');
          void promoInput.offsetWidth;
          promoInput.classList.add('shake');
        }
      });
    })();