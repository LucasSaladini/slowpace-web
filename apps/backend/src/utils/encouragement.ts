export const ENCOURAGMENT_PHRASES = {
    grounding: [
        "Respire fundo. Esse tempo foi seu e de mais ninguém.",
        "Cada minuto dedicado a você é uma raiz que se fortalece.",
        "Você deve esteve presente. Isso é o que mais importa.",
        "O progresso não é apenas velocidade, é direção.",
        "Sinta o peso do seu esforço se transformar em leveza",
        "O mundo esperou enquanto você cuidava de si.",
        "Silencie o ruído externo: sua prática é sua verdade.",
        "Não há pressa onde existe presença.",
        "Um passo lento ainda é um passo à frente.",
        "Sua constelação brilha mais forte com a sua constância."
    ],
    reflective: [
        "O que essa prática ensinou ao seu silêncio hoje?",
        "Como o seu corpo se sente após esse momento?",
        "Honre o esforço que você colocou aqui.",
        "Sua dedicação é uma forma de respeito próprio.",
        "A semente que você plantou hoje florescerá no seu tempo.",
        "Reconheça a coragem de ter começado hoje.",
        "O tempo que você 'perde' com você mesmo é ganho em alma.",
        "Sua jornada é única, não a compare com mapas alheios.",
        "O cultivo de hoje é o descanso de amanhã.",
        "Sinta a satisfação de ter honrado seu compromisso."
    ]
};

export const getRandomPhrase = () => {
    const allPhrases = [...ENCOURAGMENT_PHRASES.grounding, ...ENCOURAGMENT_PHRASES.reflective];
    
    return allPhrases[Math.floor(Math.random() * allPhrases.length)];
};