export function getGreeting(name: string, date: Date = new Date()): string {
  const hour = date.getHours();
  let greetings: string[];

  if (hour >= 5 && hour < 12) {
    greetings = [
      "Bonjour {name} 👋 Que puis-je faire pour vous ?",
      "Bonjour {name}, matinée démarrée ?",
      "Belle matinée {name} ! On commence par quoi ?",
      "Bonjour {name}, prêt(e) à avancer sur vos projets ?",
    ];
  } else if (hour >= 12 && hour < 14) {
    greetings = [
      "Bon appétit {name} ! Une question en attendant ?",
      "Bonjour {name}, pause déjeuner productive ?",
      "Bon midi {name}. Que puis-je faire pour vous ?",
    ];
  } else if (hour >= 14 && hour < 18) {
    greetings = [
      "Bon après-midi {name} ! Que puis-je faire pour vous ?",
      "Bon après-midi {name}, on continue sur vos projets ?",
      "Ravi de vous revoir {name}. Par quoi commençons-nous ?",
    ];
  } else if (hour >= 18 && hour < 23) {
    greetings = [
      "Bonsoir {name} 👋 Que puis-je faire pour vous ?",
      "Bonsoir {name}, une dernière tâche avant de clôturer ?",
      "Bonsoir {name}, on finalise quelque chose ensemble ?",
    ];
  } else {
    greetings = [
      "Il se fait tard, {name}, on continue ?",
      "Bonne nuit {name}… ou séance créative nocturne ?",
      "Encore debout {name} ? Je reste à vos côtés.",
      "La nuit porte conseil, {name}. Que préparons-nous ?",
    ];
  }

  const greeting = greetings[Math.floor(Math.random() * greetings.length)];
  return greeting.replace("{name}", name);
}
