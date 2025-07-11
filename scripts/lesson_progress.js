// scripts/lesson_progress.js

document.addEventListener('DOMContentLoaded', () => {
  // Seleciona todos os cards de lição no mapa
  const lessonCards = document.querySelectorAll(
    '.lesson-map-container .lesson-card'
  );

  if (typeof Storage !== 'undefined') {
    lessonCards.forEach((card) => {
      // Assumimos que cada card tem um link interno com um href para a lição
      // Ex: <a href="day.html?id=day1"> ou <a href="day1.html">
      const lessonLink = card.querySelector('a');
      if (lessonLink) {
        let lessonId;
        const href = lessonLink.getAttribute('href');

        // Tenta extrair o ID da lição da URL
        // Ex: "day.html?id=day1" -> "day1"
        // Ex: "day1.html" -> "day1"
        const urlMatch = href.match(/(day(\d+))(\.html)?(\?id=)?(day(\d+))?/i);
        if (urlMatch && urlMatch[2]) {
          // Captura o número do dia do primeiro grupo (day1)
          lessonId = `day${urlMatch[2]}`;
        } else if (urlMatch && urlMatch[6]) {
          // Captura o número do dia do segundo grupo (id=day1)
          lessonId = `day${urlMatch[6]}`;
        } else {
          console.warn(`Não foi possível extrair lessonId de: ${href}`);
          return; // Pula para o próximo card se o ID não for encontrado
        }

        // Verifica se a lição foi marcada como visitada no localStorage
        if (localStorage.getItem(`lesson_${lessonId}`) === 'visited') {
          card.classList.add('visited'); // Adiciona a classe CSS
          console.log(`Card para lição ${lessonId} marcado como visitado.`);
        }
      }
    });
  } else {
    console.warn(
      'Seu navegador não suporta localStorage. O progresso não será exibido.'
    );
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // Seleciona todos os cards de lição no mapa
  const lessonCards = document.querySelectorAll(
    '.lesson-map-container .lesson-card'
  );
  // Seleciona o botão de zerar progresso
  const resetButton = document.getElementById('reset-lessons-button');

  // Função para aplicar a classe 'visited' aos cards
  function updateLessonCardsStatus() {
    if (typeof Storage !== 'undefined') {
      lessonCards.forEach((card) => {
        const lessonLink = card.querySelector('a');
        if (lessonLink) {
          let lessonId;
          const href = lessonLink.getAttribute('href');

          const urlMatch = href.match(
            /(day(\d+))(\.html)?(\?id=)?(day(\d+))?/i
          );
          if (urlMatch && urlMatch[2]) {
            lessonId = `day${urlMatch[2]}`;
          } else if (urlMatch && urlMatch[6]) {
            lessonId = `day${urlMatch[6]}`;
          } else {
            console.warn(`Não foi possível extrair lessonId de: ${href}`);
            return;
          }

          if (localStorage.getItem(`lesson_${lessonId}`) === 'visited') {
            card.classList.add('visited');
          } else {
            card.classList.remove('visited'); // Garante que a classe seja removida se o progresso for zerado
          }
        }
      });
    } else {
      console.warn(
        'Seu navegador não suporta localStorage. O progresso não será exibido/salvo.'
      );
    }
  }

  // Função para zerar o progresso
  function resetAllLessons() {
    if (
      confirm(
        'Tem certeza que deseja zerar todo o seu progresso? Esta ação não pode ser desfeita!'
      )
    ) {
      if (typeof Storage !== 'undefined') {
        // Percorre todos os itens do localStorage e remove os relacionados a lições
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key.startsWith('lesson_')) {
            localStorage.removeItem(key);
          }
        }
        console.log('Progresso de todas as lições zerado.');
        updateLessonCardsStatus(); // Atualiza o status visual dos cards
      }
    }
  }

  // Chama a função para atualizar o status dos cards ao carregar a página
  updateLessonCardsStatus();

  // Adiciona o event listener ao botão de zerar progresso
  if (resetButton) {
    resetButton.addEventListener('click', resetAllLessons);
  }
});
