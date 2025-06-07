import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fvgkwcvwqbdugexretbi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2Z2t3Y3Z3cWJkdWdleHJldGJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyMDAwMzMsImV4cCI6MjA2NDc3NjAzM30.1uQjmY4OKycYzSUl-q9VFWjYiRTNux36i7H17T1pmmA';
const supabase = createClient(supabaseUrl, supabaseKey);

const articlesDiv = document.getElementById('Articles');
const form = document.getElementById('article-form');

async function fetchArticles() {
  const { data, error } = await supabase
    .from('Articles') // <-- poprawiona nazwa
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    articlesDiv.textContent = 'Błąd podczas pobierania artykułów';
    console.error(error);
    return;
  }

  articlesDiv.innerHTML = '';

  data.forEach(article => {
    const articleEl = document.createElement('article');
    articleEl.style.borderBottom = '1px solid #ccc';
    articleEl.style.marginBottom = '20px';

    articleEl.innerHTML = `
      <h2>${article.title}</h2>
      <h4>${article.subtitle}</h4>
      <p><em>Autor: ${article.author} | Data: ${new Date(article.created_at).toLocaleString()}</em></p>
      <p>${article.content}</p>
    `;

    articlesDiv.appendChild(articleEl);
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const newArticle = {
    title: formData.get('title'),
    subtitle: formData.get('subtitle'),
    author: formData.get('author'),
    content: formData.get('content'),
  };

  const { error } = await supabase.from('articles').insert([newArticle]);
  if (error) {
    console.error('Błąd podczas dodawania artykułu:', error.message || error);
    alert('Nie udało się dodać artykułu:\n' + (error.message || JSON.stringify(error)));
  } else {
    form.reset();
    fetchArticles();
  }
});

fetchArticles();

