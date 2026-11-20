// Conkat — ajustes 1 (rodar no Scripter, depois do code.js)
// 1. Desktop: título do hero menor (76 → 72 px) para não encostar no celular.
// 2. Mobile: card flutuante de avaliação desce para a borda inferior do celular.

(async () => {
  const page = figma.root.children.find((p) => p.name === "Site — Desktop") || figma.currentPage;
  await figma.setCurrentPageAsync(page);
  await figma.loadFontAsync({ family: "Schibsted Grotesk", style: "SemiBold" });

  const style = (await figma.getLocalTextStylesAsync()).find((s) => s.name === "Display/XL");
  if (style) { style.fontSize = 72; style.lineHeight = { unit: "PIXELS", value: 76 }; }

  const M = page.findOne((n) => n.type === "FRAME" && n.name === "Site Conkat — Mobile");
  const stage = M && M.findOne((n) => n.name === "Celulares");
  const card = stage && stage.findOne((n) => n.name === "Flutuante — avaliação");
  if (card) { card.x = 16; card.y = stage.height - card.height - 18; }

  figma.notify("Conkat: ajustes aplicados.");
})();
