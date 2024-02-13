document.addEventListener("DOMContentLoaded", function () {
  const fileList = document.getElementById("file-list");
  const newFileBtn = document.getElementById("newFileBtn");
  const editorContent = document.getElementById("editorContent");
  const saveBtn = document.getElementById("saveBtn");
  const loadBtn = document.getElementById("loadBtn");

  fetch("/files")
    .then((response) => response.json())
    .then((files) => {
      files.forEach((file) => {
        const li = document.createElement("li");
        li.textContent = file;
        fileList.appendChild(li);
      });
    })
    .catch((error) => {
      console.error("Error fetching files:", error);
    });
  fileList.addEventListener("click", function (event) {
    const selectedFile = event.target.textContent;

    fetch(`/files/${selectedFile}`)
      .then((response) => response.text())
      .then((content) => {
        editorContent.value = content;
      });
  });
  newFileBtn.addEventListener("click", function (event) {
    editorContent.value = "";
  });

  saveBtn.addEventListener("click", function (event) {
    const filename = prompt("Введите имя файла");
    const content = editorContent.value;

    fetch("/files", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename, content }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
      });
  });

  loadBtn.addEventListener("click", function (event) {
    const filename = prompt("Введите имя файла");
    fetch(`/files/${filename}`)
      .then((response) => response.text())
      .then((content) => {
        editorContent.value = content;
      })
      .catch(() => {
        alert("Файл не найден");
      });
  });
});
