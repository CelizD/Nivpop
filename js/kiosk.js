// ════════ FLAVOR DATA ════════
const F={
  fresa:{cls:'th-fresa',c:'var(--rose)',c2:'var(--rose2)',name:'Frambesa y Fresa',persona:'La Corazón Abierto',desc:'Apasionado/a, empático/a y completamente presente. Sientes profundo y amas sin medias tintas.',ins:{tag:'TU ESENCIA',text:'Traes calidez de forma natural, sin esfuerzo consciente. Tu intensidad emocional no es un exceso — es profundidad de presencia real.',hl:'Sientes profundo porque estás completamente vivo/a.'},psych:'La psicología positiva de Fredrickson demuestra que las emociones intensas amplían el repertorio de acción. Tu empatía elevada correlaciona con mayor conexión auténtica.',traits:[{l:'INTENSIDAD',v:'Muy alta'},{l:'EMPATÍA',v:'Profunda'},{l:'ENERGÍA',v:'Cálida'},{l:'CONEXIÓN',v:'Intensa'}],tips:[{t:'<strong>Practica recibir</strong> con la misma naturalidad con que das.'},{t:'<strong>Date tiempo para procesar</strong> tras experiencias muy emotivas.'},{t:'<strong>Escribe lo que sientes</strong> antes de comunicarlo.'},{t:'<strong>Aprende a decir que no</strong> sin culpa.'}],base:{rec:'Leche entera',recD:'Potencia la cremosidad y el dulzor natural.',alt:'Leche vegetal',altD:'Avena o coco como alternativa sin lactosa.'},allergens:{lacteos:true,gluten:false,huevo:false,frutosSecs:false,soja:false,sulfitos:true},allergenNotes:{lacteos:'Contiene leche',sulfitos:'En frambesas procesadas'},baseType:'leche'},
  vainilla:{cls:'th-vainilla',c:'var(--gold)',c2:'var(--gold2)',name:'Vainilla y Coco',persona:'El Alma Serena',desc:'Clásico/a pero nunca predecible. Tu presencia tiene un efecto regulador sobre quienes te rodean.',ins:{tag:'TU ESENCIA',text:'La vainilla es el sabor más complejo de la naturaleza pese a ser percibida como simple. Igual que tú.',hl:'Tu calma no es indiferencia. Es fortaleza bien sostenida.'},psych:'La psicología del apego describe tu perfil como estilo seguro: puedes mantener intimidad sin perder tu centro. (John Bowlby)',traits:[{l:'ESTABILIDAD',v:'Alta'},{l:'APEGO',v:'Seguro'},{l:'RITMO',v:'Pausado'},{l:'PROFUNDIDAD',v:'Rica'}],tips:[{t:'<strong>Permítete sentir</strong> sin buscar la calma de inmediato.'},{t:'<strong>Comparte más de lo que piensas.</strong>'},{t:'<strong>Introduce novedad gradual.</strong>'},{t:'<strong>Expresa tu afecto en palabras.</strong>'}],base:{rec:'Agua',recD:'Resalta la pureza de la vainilla y la frescura del coco.',alt:'Leche entera',altD:'Opción más cremosa.'},allergens:{lacteos:false,gluten:false,huevo:false,frutosSecs:true,soja:false,sulfitos:false},allergenNotes:{frutosSecs:'Coco'},baseType:'agua'},
  menta:{cls:'th-menta',c:'var(--mint)',c2:'var(--mint2)',name:'Menta y Lima',persona:'La Mente Brillante',desc:'Refrescante, rápido/a y con algo interesante que aportar siempre. Tu mente no se detiene — y eso es una ventaja.',ins:{tag:'TU ESENCIA',text:'La menta despierta los sentidos. Tú haces lo mismo en los entornos donde participas.',hl:'Tu mente, bien descansada, puede con todo.'},psych:'El modelo de los Cinco Grandes te ubica con puntuaciones altas en Apertura a la Experiencia. Adam Grant llama a esto "pensamiento generativo".',traits:[{l:'CURIOSIDAD',v:'Muy alta'},{l:'APERTURA',v:'Máxima'},{l:'RITMO',v:'Rápido'},{l:'CREATIVIDAD',v:'Activa'}],tips:[{t:'<strong>Practica el silencio mental deliberado.</strong>'},{t:'<strong>Date espacio para sentir</strong> sin analizar.'},{t:'<strong>Termina lo que empiezas.</strong>'},{t:'<strong>Cuida tu cuerpo</strong> con la misma atención que tu mente.'}],base:{rec:'Agua',recD:'Potencia la frescura de la menta y la acidez de la lima.',alt:'Solo agua',altD:'Diseñado para base de agua.'},allergens:{lacteos:false,gluten:false,huevo:false,frutosSecs:false,soja:false,sulfitos:false},allergenNotes:{},baseType:'agua'},
  choco:{cls:'th-choco',c:'var(--mocha)',c2:'var(--mocha2)',name:'Chocolate y Café',persona:'La Profundidad Elegante',desc:'Complejo/a, intenso/a y con capas que pocos llegan a conocer. Tienes un mundo interior extraordinariamente rico.',ins:{tag:'TU ESENCIA',text:'El chocolate es el sabor más parecido a las emociones humanas: amargo, dulce, profundo. Igual que tú.',hl:'Tu profundidad no es complicación. Es riqueza.'},psych:'La psicología Junguiana reconoce en ti una vida interior muy desarrollada: alta introspección y habilidad para sostener paradojas emocionales.',traits:[{l:'VIDA INTERIOR',v:'Muy rica'},{l:'INTROSPECCIÓN',v:'Natural'},{l:'INTENSIDAD',v:'Controlada'},{l:'MADUREZ',v:'Emocional'}],tips:[{t:'<strong>Busca momentos de ligereza</strong> deliberada.'},{t:'<strong>Comparte tu mundo interior</strong> con alguien de confianza.'},{t:'<strong>Celebra lo cotidiano.</strong>'},{t:'<strong>Permítete ser cuidado/a.</strong>'}],base:{rec:'Leche entera',recD:'Potencia los aromas del cacao y suaviza el café.',alt:'Leche de avena',altD:'La avena complementa el chocolate sin dominar.'},allergens:{lacteos:true,gluten:false,huevo:false,frutosSecs:false,soja:false,sulfitos:false},allergenNotes:{lacteos:'Leche entera en base.'},baseType:'leche'},
  mango:{cls:'th-mango',c:'var(--peach)',c2:'var(--peach2)',name:'Mango y Maracuyá',persona:'La Energía Solar',desc:'Vibrante, espontáneo/a y con una energía que llena los espacios. Amas la vida de forma genuina.',ins:{tag:'TU ESENCIA',text:'El mango es el sabor de la alegría sin disculpas. Tú te permites disfrutar sin necesitar justificación.',hl:'Tu alegría no es superficial. Es una elección valiente.'},psych:'Martin Seligman identificaría en ti fortalezas como vitalidad, entusiasmo y esperanza — predictores robustos de resiliencia.',traits:[{l:'VITALIDAD',v:'Alta'},{l:'ESPONTANEIDAD',v:'Natural'},{l:'ALEGRÍA',v:'Genuina'},{l:'RESILIENCIA',v:'Rápida'}],tips:[{t:'<strong>Cultiva la quietud deliberada.</strong>'},{t:'<strong>Aprende a estar con emociones difíciles.</strong>'},{t:'<strong>Pon tus metas por escrito.</strong>'},{t:'<strong>Profundiza en relaciones</strong> más allá de los buenos momentos.'}],base:{rec:'Agua',recD:'Resalta la acidez tropical del mango y la maracuyá.',alt:'Leche de coco',altD:'Suma cremosidad tropical.'},allergens:{lacteos:false,gluten:false,huevo:false,frutosSecs:false,soja:false,sulfitos:false},allergenNotes:{},baseType:'agua'},
  lavanda:{cls:'th-lavanda',c:'var(--lav)',c2:'var(--lav2)',name:'Lavanda y Arándano',persona:'La Sensibilidad Creativa',desc:'Soñador/a, sensible e intuitivo/a. Percibes dimensiones que otros pasan por alto. Tienes una relación privilegiada con el arte.',ins:{tag:'TU ESENCIA',text:'La lavanda calma y eleva al mismo tiempo. Haces que otros se sientan vistos con un esfuerzo mínimo.',hl:'Tu sensibilidad no es debilidad. Es inteligencia.'},psych:'Elaine Aron acuñó el término Persona Altamente Sensible (PAS) para tu perfil: procesamiento profundo, empatía aguda y reactividad estética elevada.',traits:[{l:'SENSIBILIDAD',v:'Alta (PAS)'},{l:'INTUICIÓN',v:'Aguda'},{l:'CREATIVIDAD',v:'Natural'},{l:'ESTÉTICA',v:'Elevada'}],tips:[{t:'<strong>Protege tu energía</strong> de forma consciente.'},{t:'<strong>Pon límites sin culpa.</strong>'},{t:'<strong>Confía en tu intuición.</strong>'},{t:'<strong>Comparte lo que creas.</strong>'}],base:{rec:'Agua o leche',recD:'En agua: más floral. En leche: más cremoso.',alt:'Leche de almendra',altD:'La almendra complementa la lavanda con elegancia.'},allergens:{lacteos:false,gluten:false,huevo:false,frutosSecs:true,soja:false,sulfitos:false},allergenNotes:{frutosSecs:'Almendra si se usa como base.'},baseType:'ambas'},
  matcha:{cls:'th-matcha',c:'var(--teal)',c2:'var(--teal2)',name:'Matcha y Pistache',persona:'La Mente Consciente',desc:'Buscas el equilibrio entre la disciplina y el placer. Tienes la rara capacidad de ser riguroso/a sin perder la sensorialidad.',ins:{tag:'TU ESENCIA',text:'El matcha requiere preparación cuidadosa para revelar su mejor versión. Tú funcionas igual: tu profundidad emerge cuando hay intención.',hl:'Tu disciplina no es restricción. Es la forma en que te respetas.'},psych:'La psicología del autocontrol de Roy Baumeister: alta autorregulación que, equilibrada con disfrute consciente, produce bienestar sostenido.',traits:[{l:'AUTODISCIPLINA',v:'Alta'},{l:'CONSCIENCIA',v:'Muy presente'},{l:'EQUILIBRIO',v:'Buscado'},{l:'PLACER',v:'Merecido'}],tips:[{t:'<strong>Permite el desorden ocasional.</strong>'},{t:'<strong>Celebra los logros sin condiciones.</strong>'},{t:'<strong>Comparte tu proceso,</strong> no solo tus resultados.'},{t:'<strong>Practica el placer sin propósito.</strong>'}],base:{rec:'Leche de almendra',recD:'La almendra realza los matices herbales del matcha y el pistache.',alt:'Leche de avena',altD:'La avena da cuerpo sin restar elegancia.'},allergens:{lacteos:false,gluten:false,huevo:false,frutosSecs:true,soja:false,sulfitos:false},allergenNotes:{frutosSecs:'Pistache y almendra'},baseType:'leche'},
  miel:{cls:'th-miel',c:'var(--amber)',c2:'var(--amber2)',name:'Miel y Jengibre',persona:'La Calidez Reparadora',desc:'Eres el refugio de los demás en momentos de crisis. Tu capacidad de sostener a otros no es sacrificio — es vocación.',ins:{tag:'TU ESENCIA',text:'La miel cura. El jengibre activa. Tú combinas eso: la ternura que reconforta y la fuerza que mueve.',hl:'Cuidas porque puedes. Ahora aprende a dejar que te cuiden a ti.'},psych:'La psicología del cuidado estudia tu perfil. Kristin Neff demuestra que la autocompasión es requisito, no lujo.',traits:[{l:'EMPATÍA',v:'Muy alta'},{l:'CUIDADO',v:'Vocacional'},{l:'CALIDEZ',v:'Natural'},{l:'FORTALEZA',v:'Silenciosa'}],tips:[{t:'<strong>Practica recibir ayuda</strong> sin convertirla en deuda.'},{t:'<strong>Pon límites desde el amor,</strong> no desde el agotamiento.'},{t:'<strong>Date a ti mismo/a</strong> la misma atención que das.'},{t:'<strong>Identifica quién te cuida a ti.</strong>'}],base:{rec:'Agua',recD:'Resalta la miel y la intensidad del jengibre.',alt:'Leche entera',altD:'Con leche la miel se vuelve más reconfortante.'},allergens:{lacteos:false,gluten:false,huevo:false,frutosSecs:false,soja:false,sulfitos:false},allergenNotes:{},baseType:'agua'},
  higo:{cls:'th-higo',c:'var(--fig)',c2:'var(--fig2)',name:'Higo y Queso Crema',persona:'La Tradición Evolucionada',desc:'Valoras profundamente tus raíces pero no temes reinventarte. Arraigo e innovación — una combinación poco común.',ins:{tag:'TU ESENCIA',text:'El higo es uno de los sabores más antiguos. El queso crema es contemporáneo. Tú eres exactamente esa combinación.',hl:'Honras lo que vino antes sin quedar atrapado/a en ello.'},psych:'Erik Erikson describiría tu perfil como alta integridad del ego: capacidad de honrar el pasado sin que este limite el presente.',traits:[{l:'ARRAIGO',v:'Profundo'},{l:'ADAPTACIÓN',v:'Activa'},{l:'LEALTAD',v:'Selectiva'},{l:'EVOLUCIÓN',v:'Intencional'}],tips:[{t:'<strong>Distingue lo que vale conservar</strong> de lo que conservas por miedo.'},{t:'<strong>Permite que tu identidad evolucione.</strong>'},{t:'<strong>Comparte tu historia.</strong>'},{t:'<strong>Date permiso de innovar.</strong>'}],base:{rec:'Leche entera',recD:'Potencia la textura del queso crema y la dulzura del higo.',alt:'Leche de avena',altD:'Cremosidad sin lactosa.'},allergens:{lacteos:true,gluten:false,huevo:false,frutosSecs:false,soja:false,sulfitos:false},allergenNotes:{lacteos:'Queso crema — contiene lácteos.'},baseType:'leche'},
  caramelo:{cls:'th-caramelo',c:'var(--caramel)',c2:'var(--caramel2)',name:'Caramelo Salado',persona:'La Dualidad Dinámica',desc:'Navegas con éxito entre tus contradicciones. Puedes ser dulce y directo/a, suave y firme. Esa dualidad es sofisticación real.',ins:{tag:'TU ESENCIA',text:'El caramelo salado fue revolucionario porque nadie creía que lo dulce y lo salado podían coexistir con elegancia. Tú vives esa verdad.',hl:'No tienes que elegir quién ser. Puedes ser todo eso a la vez.'},psych:'La psicología de la complejidad del yo (Patricia Linville) muestra que personas con identidades multifacéticas tienen mayor resiliencia emocional.',traits:[{l:'COMPLEJIDAD',v:'Alta'},{l:'ADAPTABILIDAD',v:'Natural'},{l:'AUTENTICIDAD',v:'Multifaceta'},{l:'RESILIENCIA',v:'Robusta'}],tips:[{t:'<strong>Abraza tus contradicciones.</strong>'},{t:'<strong>Comunica tus distintas facetas.</strong>'},{t:'<strong>Cuida no usar la adaptabilidad como máscara.</strong>'},{t:'<strong>Celebra la complejidad.</strong>'}],base:{rec:'Leche entera',recD:'Equilibra lo dulce del caramelo y realza el contrapunto salado.',alt:'Leche de coco',altD:'El coco agrega un toque tropical inesperadamente bueno.'},allergens:{lacteos:true,gluten:false,huevo:false,frutosSecs:false,soja:false,sulfitos:false},allergenNotes:{lacteos:'Base de leche entera.'},baseType:'leche'},
  yuzu:{cls:'th-yuzu',c:'var(--yuzu)',c2:'var(--yuzu2)',name:'Yuzu y Albahaca',persona:'El Espíritu Eléctrico',desc:'Tu energía es contagiosa, disruptiva y puramente original. No encajas en categorías fáciles — y ya dejaste de intentarlo.',ins:{tag:'TU ESENCIA',text:'El yuzu no se parece a ningún otro cítrico. Tú tienes esa misma singularidad que no puede imitarse.',hl:'Tu originalidad no es performance. Es simplemente cómo eres.'},psych:'Mihaly Csikszentmihalyi identificaría en ti alta creatividad intrínseca: orientación natural hacia la novedad y la ruptura de patrones.',traits:[{l:'ORIGINALIDAD',v:'Radical'},{l:'DISRUPCIÓN',v:'Natural'},{l:'ENERGÍA',v:'Eléctrica'},{l:'SINGULARIDAD',v:'Innegable'}],tips:[{t:'<strong>Encuentra entornos que te permitan ser disruptivo/a.</strong>'},{t:'<strong>Aprende a aterrizar tus ideas.</strong>'},{t:'<strong>Cuida tu energía.</strong>'},{t:'<strong>Conecta con personas igualmente originales.</strong>'}],base:{rec:'Agua',recD:'Permite que el yuzu y la albahaca brillen.',alt:'Leche de coco',altD:'El coco suaviza la intensidad.'},allergens:{lacteos:false,gluten:false,huevo:false,frutosSecs:false,soja:false,sulfitos:false},allergenNotes:{},baseType:'agua'},
  earl:{cls:'th-earl',c:'var(--earl)',c2:'var(--earl2)',name:'Té Earl Grey y Limón',persona:'La Serenidad Intelectual',desc:'Encuentras la belleza en el orden y el pensamiento crítico. Tu mente trabaja con precisión.',ins:{tag:'TU ESENCIA',text:'El Earl Grey es sofisticado, no ostentoso. Tú tienes esa misma cualidad: presencia que se nota sin imponerse.',hl:'Tu inteligencia no necesita demostrarse. Se siente.'},psych:'La psicología cognitiva describe tu perfil como alto estilo reflexivo: procesas con profundidad antes de emitir juicio.',traits:[{l:'PENSAMIENTO',v:'Crítico y fino'},{l:'ESTÉTICA',v:'Del orden'},{l:'SERENIDAD',v:'Intelectual'},{l:'PRECISIÓN',v:'Natural'}],tips:[{t:'<strong>Practica la imprecisión deliberada.</strong>'},{t:'<strong>Comunica con más calidez.</strong>'},{t:'<strong>Permite que te sorprendan.</strong>'},{t:'<strong>Busca espacios donde tu precisión sea valorada.</strong>'}],base:{rec:'Leche de avena',recD:'La avena complementa los taninos del té con cremosidad contemporánea.',alt:'Leche entera',altD:'Da más cuerpo al perfil del Earl Grey.'},allergens:{lacteos:false,gluten:false,huevo:false,frutosSecs:false,soja:false,sulfitos:false},allergenNotes:{},baseType:'leche'},
  chai:{cls:'th-chai',c:'var(--chai)',c2:'var(--chai2)',name:'Chai y Canela',persona:'El Alma Especiada',desc:'Posees una sabiduría antigua y una hospitalidad natural. Haces que los demás se sientan bienvenidos sin esfuerzo.',ins:{tag:'TU ESENCIA',text:'El chai es una mezcla de sabores que por separado podrían ser demasiado — juntos crean algo perfectamente armonioso. Igual que tú.',hl:'Tu sabiduría no vino de libros. Vino de vivir y prestar mucha atención.'},psych:'La psicología de la sabiduría (Monika Ardelt) describe tres dimensiones: cognitiva, reflexiva y afectiva. Tu perfil integra las tres.',traits:[{l:'SABIDURÍA',v:'Vivida'},{l:'HOSPITALIDAD',v:'Natural'},{l:'CALIDEZ',v:'Especiada'},{l:'MEMORIA',v:'Afectiva'}],tips:[{t:'<strong>Comparte tu sabiduría con intención.</strong>'},{t:'<strong>Renueva tus perspectivas.</strong>'},{t:'<strong>Cuida no dar más de lo que tienes.</strong>'},{t:'<strong>Honra tu historia.</strong>'}],base:{rec:'Leche entera',recD:'Potencia la intensidad de las especias. Envolvente.',alt:'Leche de coco',altD:'El coco agrega un toque exótico.'},allergens:{lacteos:true,gluten:false,huevo:false,frutosSecs:false,soja:false,sulfitos:false},allergenNotes:{lacteos:'Base de leche entera.'},baseType:'leche'},
  platano:{cls:'th-platano',c:'var(--platano)',c2:'var(--platano2)',name:'Plátano y Nuez Pecana',persona:'El Confort Nostálgico',desc:'Tu fortaleza reside en tus recuerdos y en la lealtad. Eres de los que no olvidan — ni los cumpleaños, ni las conversaciones, ni las promesas.',ins:{tag:'TU ESENCIA',text:'El plátano es el sabor de la infancia en muchas culturas. La nuez pecana agrega profundidad a lo que de otro modo sería solo dulzura.',hl:'Tu memoria afectiva no es nostalgia. Es tu forma de no perder lo que importa.'},psych:'La psicología de la nostalgia (Constantine Sedikides) muestra que el acceso sano a recuerdos positivos es un recurso de resiliencia real.',traits:[{l:'LEALTAD',v:'Profunda'},{l:'MEMORIA',v:'Afectiva'},{l:'CONFORT',v:'Generoso'},{l:'ARRAIGO',v:'Emocional'}],tips:[{t:'<strong>Permite que el presente sea tan rico como el pasado.</strong>'},{t:'<strong>Aplica tu lealtad con discernimiento.</strong>'},{t:'<strong>Crea nuevos recuerdos activamente.</strong>'},{t:'<strong>Suelta lo que ya cumplió su propósito.</strong>'}],base:{rec:'Leche entera',recD:'Potencia la cremosidad del plátano y la textura de la nuez.',alt:'Leche de avena',altD:'Cremosidad sin lactosa.'},allergens:{lacteos:true,gluten:false,huevo:false,frutosSecs:true,soja:false,sulfitos:false},allergenNotes:{lacteos:'Base de leche entera.',frutosSecs:'Nuez pecana — alérgeno principal.'},baseType:'leche'},
  vino:{cls:'th-vino',c:'var(--vino)',c2:'var(--vino2)',name:'Vino Tinto y Frutos Negros',persona:'La Pasión Madura',desc:'Vives con una intensidad refinada y gran profundidad. Has vivido suficiente para saber que la pasión y la madurez no se contradicen.',ins:{tag:'TU ESENCIA',text:'El vino bueno mejora con el tiempo. Tú eres exactamente eso — una persona que ha madurado sin perder su fuego.',hl:'Tu intensidad tiene raíces. Por eso no se confunde con impulsividad.'},psych:'La psicología del desarrollo adulto (Daniel Levinson) describe esta etapa como "individuación madura": integración de la pasión y la sabiduría.',traits:[{l:'INTENSIDAD',v:'Refinada'},{l:'PROFUNDIDAD',v:'Con historia'},{l:'PASIÓN',v:'Madura'},{l:'COMPLEJIDAD',v:'Vivida'}],tips:[{t:'<strong>Comparte tu historia sin miedo.</strong>'},{t:'<strong>Permite la ligereza.</strong>'},{t:'<strong>Reconoce lo que te apasiona hoy.</strong>'},{t:'<strong>Cuida el autocuidado.</strong>'}],base:{rec:'Agua',recD:'Permite que los taninos y la acidez de los frutos negros brillen.',alt:'Leche de almendra',altD:'La almendra suaviza la intensidad.'},allergens:{lacteos:false,gluten:false,huevo:false,frutosSecs:false,soja:false,sulfitos:true},allergenNotes:{sulfitos:'Presentes en el vino y frutos negros procesados.'},baseType:'agua'},
  carda:{cls:'th-carda',c:'var(--carda)',c2:'var(--carda2)',name:'Cardamomo y Rosa',persona:'La Elegancia Mística',desc:'Posees una sensibilidad espiritual y una intuición aguda. Percibes dimensiones de la realidad que otros pasan por alto.',ins:{tag:'TU ESENCIA',text:'El cardamomo y la rosa han sido usados en rituales a lo largo de la historia humana. Tú tienes esa misma cualidad que eleva.',hl:'Tu intuición no es magia. Es una forma muy afinada de escuchar.'},psych:'William James describe la experiencia espiritual como una forma legítima de conocimiento que integra lo que la razón sola no puede alcanzar.',traits:[{l:'INTUICIÓN',v:'Muy aguda'},{l:'ESPIRITUALIDAD',v:'Propia'},{l:'ELEGANCIA',v:'Interior'},{l:'PERCEPCIÓN',v:'Extraordinaria'}],tips:[{t:'<strong>Confía en lo que sientes</strong> aunque no puedas articularlo aún.'},{t:'<strong>Protege tu espacio sagrado.</strong>'},{t:'<strong>Comunica tu mundo interior.</strong>'},{t:'<strong>Ancla tu espiritualidad en lo cotidiano.</strong>'}],base:{rec:'Leche de almendra',recD:'La almendra complementa el cardamomo y la rosa con suavidad.',alt:'Leche entera',altD:'Da más cuerpo al perfil floral.'},allergens:{lacteos:false,gluten:false,huevo:false,frutosSecs:true,soja:false,sulfitos:false},allergenNotes:{frutosSecs:'Almendra si se usa como base.'},baseType:'leche'}
};
const AL_META=[{key:'lacteos',label:'Lácteos'},{key:'gluten',label:'Gluten'},{key:'huevo',label:'Huevo'},{key:'frutosSecs',label:'Frutos secos'},{key:'soja',label:'Soja'},{key:'sulfitos',label:'Sulfitos'}];
const DUO_ALL={fresa:'La Alianza del Corazón',vainilla:'La Alianza Serena',menta:'La Alianza Brillante',choco:'La Alianza Profunda',mango:'La Alianza Solar',lavanda:'La Alianza Poética',matcha:'La Alianza Consciente',miel:'La Alianza Reparadora',higo:'La Alianza Evolucionada',caramelo:'La Alianza Dinámica',yuzu:'La Alianza Eléctrica',earl:'La Alianza Intelectual',chai:'La Alianza Especiada',platano:'La Alianza Nostálgica',vino:'La Alianza Madura',carda:'La Alianza Mística'};
const DUO_TIP={fresa:'Cuando la intensidad suba, acuerden una palabra que signifique "pausa, no abandono". Esa distinción cambia todo en vínculos como el de ustedes.',vainilla:'Introduzcan pequeñas dosis de novedad deliberada. Su estabilidad es una fortaleza, no una limitación.',menta:'Practiquen estar juntos sin analizar ni planear. El silencio compartido también es una forma de conexión.',choco:'Busquen momentos de ligereza deliberada. Su profundidad no se pierde — de hecho, se enriquece.',mango:'Reserven espacio para conversaciones difíciles. Los vínculos crecen cuando se sostienen las cosas que incomodan.',lavanda:'Practiquen la comunicación verbal directa. No siempre el otro puede leer lo que no se dice.',matcha:'Celebren el proceso, no solo el resultado. Su vínculo se fortalece cuando se permiten estar juntos también en lo imperfecto.',miel:'Identifiquen quién cuida a quienes cuidan. Los vínculos nutritivos son aquellos donde el cuidado va en ambas direcciones.',higo:'Permítanse cambiar juntos sin que eso amenace lo que han construido. Evolucionar de la mano requiere confianza.',caramelo:'Celebren sus contradicciones como dúo. No necesitan ser iguales para ser compatibles — esa diferencia es su mayor fortaleza.',yuzu:'Aprendan a aterrizar su energía compartida en proyectos concretos. Son un dúo que puede cambiar el ambiente de cualquier espacio.',earl:'Practiquen la imprecisión ocasional. No todo momento compartido necesita ser analizado — algunos simplemente necesitan vivirse.',chai:'Compartan su sabiduría con el mundo. Su vínculo tiene una calidez que otros necesitan — no la guarden solo para ustedes.',platano:'Creen nuevos recuerdos con la misma atención con que cuidan los del pasado. Su historia es una base, no un destino.',vino:'Permítanse también la ligereza. La intensidad que comparten es su fuerza — pero los mejores vínculos también saben cuándo reír.',carda:'Compartan su sensibilidad espiritual con quienes los rodean. Hay algo en la forma en que se relacionan que eleva cualquier espacio.'};
const VINCULOS={pareja:{icon:'💑',label:'Pareja'},amigos:{icon:'🫂',label:'Amigos'},hermanos:{icon:'👫',label:'Hermanos'},familia:{icon:'🏠',label:'Familia'},colegas:{icon:'🤝',label:'Colegas'},otro:{icon:'✨',label:'Otro'}};

// ════════ QUESTIONS ════════
const QP=[
  {q:'¿Cómo prefieres pasar tu tiempo libre?',o:[{t:'Con personas que me llenen de energía',s:{fresa:3,miel:1}},{t:'En calma, sin mucho estímulo externo',s:{vainilla:3,matcha:1}},{t:'Explorando algo nuevo — un lugar o una idea',s:{menta:3,yuzu:1}},{t:'A solas con mis pensamientos',s:{choco:3,earl:1}},{t:'En una aventura espontánea sin plan',s:{mango:3}},{t:'Creando algo — arte, escritura o música',s:{lavanda:3,carda:1}},{t:'Con un ritual consciente — meditación, lectura',s:{matcha:3}},{t:'Cocinando o recibiendo a personas queridas',s:{chai:3,platano:1}}]},
  {q:'¿Cómo describes tu forma de comunicarte?',o:[{t:'Directo/a y emocional — expreso lo que siento',s:{fresa:3,vino:1}},{t:'Calmado/a y reflexivo/a — pienso antes de hablar',s:{vainilla:3,earl:1}},{t:'Rápido/a y lleno/a de ideas',s:{menta:3,yuzu:1}},{t:'Profundo/a — prefiero conversaciones con peso',s:{choco:3}},{t:'Alegre y espontáneo/a',s:{mango:3}},{t:'Cálido/a — hago que la gente se sienta bienvenida',s:{chai:3,miel:1}},{t:'Sutil, con capas — no digo todo de frente',s:{carda:3,lavanda:1}},{t:'Muy preciso/a — cuido mucho las palabras',s:{earl:3,matcha:1}}]},
  {q:'Cuando algo difícil sucede, tu primer impulso es...',o:[{t:'Buscar a alguien con quien hablarlo',s:{fresa:3,miel:1}},{t:'Esperar con calma a que la situación se aclare',s:{vainilla:3}},{t:'Analizar qué pasó y buscar una solución',s:{menta:3,earl:1}},{t:'Procesarlo internamente, a veces durante días',s:{choco:3}},{t:'Moverme — la acción me ayuda a salir del loop',s:{mango:3,yuzu:1}},{t:'Crear algo o escuchar música para procesar',s:{lavanda:3,carda:1}},{t:'Recurrir a una rutina que me ancle',s:{matcha:3}},{t:'Buscar el aprendizaje en lo sucedido',s:{higo:3,chai:1}}]},
  {q:'¿Qué valoras más en una relación cercana?',o:[{t:'La intensidad y la conexión emocional real',s:{fresa:3,vino:1}},{t:'La estabilidad y la confianza sostenida',s:{vainilla:3,platano:1}},{t:'Las conversaciones que me hacen crecer',s:{menta:3,earl:1}},{t:'La profundidad — pocos pero genuinos',s:{choco:3}},{t:'La diversión y los buenos momentos',s:{mango:3}},{t:'Ser entendido/a sin tener que explicarlo todo',s:{lavanda:3,carda:1}},{t:'La lealtad y la memoria compartida',s:{platano:3,higo:1}},{t:'La calidez — sentirme bienvenido/a siempre',s:{chai:3,miel:1}}]},
  {q:'¿Cuál es tu mayor fortaleza?',o:[{t:'Mi capacidad de empatizar y conectar',s:{fresa:3,miel:1}},{t:'Mi calma — no entro en pánico fácilmente',s:{vainilla:3,matcha:1}},{t:'Analizo rápido y encuentro soluciones efectivas',s:{menta:3,earl:1}},{t:'Mi profundidad — proceso con mucho cuidado',s:{choco:3}},{t:'Mi resiliencia — me recupero con rapidez',s:{mango:3,caramelo:1}},{t:'Mi intuición — siento qué camino tomar',s:{lavanda:3,carda:1}},{t:'Mi disciplina y mi capacidad de mantener el foco',s:{matcha:3}},{t:'Mi capacidad de sostener lo que otros no pueden',s:{miel:3,chai:1}}]},
  {q:'¿Cómo describes tu relación con el pasado?',o:[{t:'Tengo mucho afecto por mis recuerdos',s:{fresa:3,platano:1}},{t:'Lo proceso con calma y lo uso como aprendizaje',s:{vainilla:3}},{t:'Aprendo de él y sigo — no me quedo ahí',s:{menta:3,yuzu:1}},{t:'Lo cargo de forma profunda — me forma',s:{choco:3,vino:1}},{t:'No me quedo en él — prefiero el presente',s:{mango:3}},{t:'Lo integro de forma intuitiva y simbólica',s:{carda:3,lavanda:1}},{t:'Lo honro pero no me limita — evoluciono',s:{higo:3,matcha:1}},{t:'Es mi fuente de identidad y de fuerza',s:{platano:3,chai:1}}]},
  {q:'¿Qué entorno te hace sentir más tú mismo/a?',o:[{t:'Lleno de personas que quiero cerca',s:{fresa:3}},{t:'Ordenado y tranquilo, sin estímulos de más',s:{vainilla:3,earl:1}},{t:'Con algo interesante en que pensar',s:{menta:3,matcha:1}},{t:'Silencioso, que invite a reflexionar',s:{choco:3}},{t:'Dinámico y colorido, en constante movimiento',s:{mango:3,yuzu:1}},{t:'Lleno de detalles estéticos pensados',s:{lavanda:3,carda:1}},{t:'Con historia — lugares con carácter y tradición',s:{higo:3,platano:1}},{t:'Cálido — donde pueda compartir la mesa',s:{chai:3,miel:1}}]},
  {q:'¿Cómo manifiestas que alguien te importa?',o:[{t:'Con palabras — digo directamente lo que siento',s:{fresa:3}},{t:'Con actos consistentes y presencia sostenida',s:{vainilla:3,platano:1}},{t:'Compartiendo cosas que les hacen crecer',s:{menta:3}},{t:'Con conversaciones profundas y atención total',s:{choco:3,vino:1}},{t:'Con planes espontáneos y momentos memorables',s:{mango:3,yuzu:1}},{t:'Con detalles muy pequeños y pensados',s:{lavanda:3,carda:1}},{t:'Cuidándoles — preparando algo concreto',s:{miel:3,chai:1}},{t:'Siendo leal en los momentos difíciles',s:{platano:3,higo:1}}]},
  {q:'¿Qué tipo de narrativas te atrapan más?',o:[{t:'Historias de amor y vínculo humano profundo',s:{fresa:3,vino:1}},{t:'Narrativas tranquilas y bien escritas',s:{vainilla:3,earl:1}},{t:'Ciencia ficción, misterio, ideas grandes',s:{menta:3,yuzu:1}},{t:'Dramas psicológicos o filosóficos',s:{choco:3}},{t:'Aventuras con personajes carismáticos',s:{mango:3}},{t:'Arte, poesía y narrativa sensorial',s:{lavanda:3,carda:1}},{t:'Épicas o históricas — lo que conecta pasado y presente',s:{higo:3,chai:1}},{t:'Historias de transformación y consciencia',s:{matcha:3,earl:1}}]},
  {q:'¿Cuál es tu mayor miedo?',o:[{t:'Perder a las personas que amo',s:{fresa:3,miel:1}},{t:'El caos o perder el control',s:{vainilla:3,matcha:1}},{t:'Quedarme estancado/a sin crecer',s:{menta:3,yuzu:1}},{t:'No llegar a entenderme completamente',s:{choco:3}},{t:'Perderme experiencias importantes',s:{mango:3}},{t:'No poder expresar lo que siento',s:{lavanda:3,carda:1}},{t:'No ser fiel a mis valores o mis raíces',s:{higo:3,platano:1}},{t:'Perder la intensidad o la profundidad con el tiempo',s:{vino:3,choco:1}}]},
  {q:'¿Cómo te describes en momentos de presión?',o:[{t:'Busco apoyo — no me gusta procesarlo solo/a',s:{fresa:3,miel:1}},{t:'Busco calma — el ruido me desorienta',s:{vainilla:3,matcha:1}},{t:'Me activo — la presión me hace pensar más rápido',s:{menta:3,yuzu:1}},{t:'Me profundizo — necesito entender antes de actuar',s:{choco:3,earl:1}},{t:'Me muevo — la acción física me regula',s:{mango:3}},{t:'Me apoyo en mis rutinas — el orden me sostiene',s:{matcha:3}},{t:'Recurro a lo conocido — lo familiar me da fuerza',s:{platano:3,higo:1}},{t:'Necesito un espacio de belleza o silencio',s:{lavanda:3,carda:1}}]},
  {q:'¿Qué te motiva más profundamente?',o:[{t:'Las personas y las conexiones que construyo',s:{fresa:3,miel:1}},{t:'La estabilidad y el bienestar a largo plazo',s:{vainilla:3}},{t:'El conocimiento y el crecimiento intelectual',s:{menta:3,earl:1}},{t:'Entenderme a mí mismo/a y entender el mundo',s:{choco:3,vino:1}},{t:'Vivir experiencias que valgan la pena',s:{mango:3,yuzu:1}},{t:'La belleza, la expresión y lo que me hace sentir',s:{lavanda:3,carda:1}},{t:'El equilibrio y vivir con intención',s:{matcha:3}},{t:'Dejar algo duradero para quienes vengan',s:{higo:3,platano:1}}]},
  {q:'¿Cómo quieres que te recuerden?',o:[{t:'Como alguien que amó profundo y sin miedo',s:{fresa:3,vino:1}},{t:'Como alguien que siempre estuvo cuando se necesitaba',s:{vainilla:3,platano:1}},{t:'Como alguien que cambió la forma de pensar de otros',s:{menta:3,yuzu:1}},{t:'Como alguien que dejó algo verdadero y profundo',s:{choco:3}},{t:'Como alguien que hizo la vida más alegre',s:{mango:3}},{t:'Como alguien que hacía sentir la belleza del mundo',s:{lavanda:3,carda:1}},{t:'Como alguien que cuidó con una calidez genuina',s:{miel:3,chai:1}},{t:'Como alguien que no se parecía a nadie más',s:{yuzu:3,caramelo:1}}]}
];

const QT=[
  {q:'¿Cómo describirías tu energía en este momento?',o:[{t:'Llena, me siento bien y con ganas',s:{mango:3,fresa:1}},{t:'Tranquila, en un buen equilibrio',s:{vainilla:3,matcha:1}},{t:'Curiosa, con muchas cosas en la mente',s:{menta:3,earl:1}},{t:'Profunda, procesando algo importante',s:{choco:3,vino:1}},{t:'Cansada, necesito ser cuidada',s:{miel:3,platano:1}},{t:'Creativa, con ganas de expresar algo',s:{lavanda:3,yuzu:1}},{t:'Nostálgica, con el corazón en el pasado',s:{platano:3,chai:1}},{t:'Mística, conectada con algo más grande',s:{carda:3,lavanda:1}}]},
  {q:'¿Qué necesitas más ahora mismo?',o:[{t:'Conexión — alguien con quien compartir',s:{fresa:3,miel:1}},{t:'Quietud — silencio y espacio para mí',s:{vainilla:3,matcha:1}},{t:'Estimulación — algo que encienda mi mente',s:{menta:3,yuzu:1}},{t:'Profundidad — una conversación de verdad',s:{choco:3,earl:1}},{t:'Alegría — algo ligero y divertido',s:{mango:3}},{t:'Belleza — algo que me haga sentir',s:{lavanda:3,carda:1}},{t:'Confort — algo conocido que me abrace',s:{chai:3,platano:1}},{t:'Energía — algo que me despierte',s:{miel:3,yuzu:1}}]},
  {q:'Si tu estado de ánimo fuera un color, sería...',o:[{t:'Rojo — intenso y apasionado',s:{fresa:3,vino:1}},{t:'Beige cálido — sereno y equilibrado',s:{vainilla:3}},{t:'Verde brillante — fresco y activo',s:{menta:3,matcha:1}},{t:'Negro profundo — complejo y reflexivo',s:{choco:3}},{t:'Naranja — vibrante y lleno de vida',s:{mango:3,yuzu:1}},{t:'Lila suave — soñador y sensible',s:{lavanda:3,carda:1}},{t:'Dorado — cálido y con historia',s:{chai:3,platano:1}},{t:'Azul profundo — sereno pero intenso',s:{earl:3,vino:1}}]},
  {q:'¿Qué tipo de espacio te hace sentir bien hoy?',o:[{t:'Uno lleno de personas y movimiento',s:{fresa:3,mango:1}},{t:'Uno tranquilo, ordenado y sin ruido',s:{vainilla:3,earl:1}},{t:'Una cafetería con buena conversación',s:{menta:3,chai:1}},{t:'Uno íntimo y silencioso para pensar',s:{choco:3}},{t:'Afuera — luz, cielo, naturaleza',s:{mango:3,yuzu:1}},{t:'Uno lleno de arte o música',s:{lavanda:3,carda:1}},{t:'La casa de alguien que quiero',s:{platano:3,miel:1}},{t:'Uno con incienso, velas, calma ritual',s:{carda:3,matcha:1}}]},
  {q:'¿Qué tipo de sabor se antoja más ahora?',o:[{t:'Algo dulce y frutal — refrescante',s:{fresa:3,mango:1}},{t:'Algo suave y delicado — sin sobresaltos',s:{vainilla:3}},{t:'Algo fresco y con punch — que despierte',s:{menta:3,yuzu:1}},{t:'Algo intenso y complejo — con capas',s:{choco:3,vino:1}},{t:'Algo tropical y vibrante — veraniego',s:{mango:3}},{t:'Algo floral y sutil — que eleve',s:{lavanda:3,carda:1}},{t:'Algo cálido y reconfortante — especiado',s:{chai:3,miel:1}},{t:'Algo nostálgico — un sabor de siempre',s:{platano:3,higo:1}}]},
  {q:'¿Cuál es el pensamiento que más se repite hoy?',o:[{t:'Extraño a alguien o quiero estar con alguien',s:{fresa:3,platano:1}},{t:'Necesito un momento de calma real',s:{vainilla:3,matcha:1}},{t:'Hay algo que quiero entender o resolver',s:{menta:3,earl:1}},{t:'Estoy procesando algo que no termino de digerir',s:{choco:3,vino:1}},{t:'Quiero hacer algo espontáneo y diferente',s:{mango:3,yuzu:1}},{t:'Siento algo que no sé cómo nombrarlo',s:{lavanda:3,carda:1}},{t:'Necesito que alguien me cuide hoy',s:{miel:3,chai:1}},{t:'Estoy pensando en el pasado o en alguien de antes',s:{platano:3,higo:1}}]},
  {q:'Si hoy fuera una canción, sería...',o:[{t:'Una canción de amor intensa',s:{fresa:3,vino:1}},{t:'Un piano lento y tranquilo',s:{vainilla:3,earl:1}},{t:'Algo indie con letras interesantes',s:{menta:3,yuzu:1}},{t:'Jazz oscuro y complejo',s:{choco:3}},{t:'Pop tropical lleno de energía',s:{mango:3}},{t:'Una melodía etérea y envolvente',s:{lavanda:3,carda:1}},{t:'Música de fondo de una tarde con té',s:{chai:3,platano:1}},{t:'Una canción de los que ya no están',s:{platano:3,vino:1}}]},
  {q:'¿Cómo quieres que termine este día?',o:[{t:'Con alguien que quiero, compartiendo',s:{fresa:3,miel:1}},{t:'En silencio total — solo yo',s:{vainilla:3,matcha:1}},{t:'Habiendo aprendido algo nuevo',s:{menta:3,earl:1}},{t:'Con una conversación profunda',s:{choco:3}},{t:'Cansado/a pero con una sonrisa',s:{mango:3,yuzu:1}},{t:'Habiendo creado o expresado algo',s:{lavanda:3,carda:1}},{t:'Con algo rico, caliente y tranquilo',s:{chai:3,platano:1}},{t:'En un espacio de calma y consciencia',s:{carda:3,matcha:1}}]},
  {q:'Una sola palabra para describir cómo te sientes hoy:',o:[{t:'Conectado/a',s:{fresa:3}},{t:'Tranquilo/a',s:{vainilla:3,matcha:1}},{t:'Curioso/a',s:{menta:3}},{t:'Reflexivo/a',s:{choco:3,earl:1}},{t:'Energético/a',s:{mango:3,yuzu:1}},{t:'Sensible',s:{lavanda:3,carda:1}},{t:'Nostálgico/a',s:{platano:3,chai:1}},{t:'Intenso/a',s:{vino:3,fresa:1}}]}
];

// ════ CARGAR PREGUNTAS CUSTOM DESDE EL DASHBOARD ════
// Si el dashboard agregó preguntas via IA, se inyectan aquí automáticamente
(function loadCustomQuestions(){
  try {
    const raw = localStorage.getItem('nivpop_custom_questions');
    if (!raw) return;
    const custom = JSON.parse(raw);
    if (!Array.isArray(custom) || !custom.length) return;
    // Mezclar preguntas custom en QP
    custom.forEach(q => {
      // Evitar duplicados
      if (!QP.find(existing => existing.q === q.q)) {
        QP.push({ q: q.q, o: q.o });
      }
    });
    console.log(`[NIV'Pop Kiosco] ${custom.length} preguntas custom cargadas`);
  } catch(e) {
    console.warn('[custom questions]', e);
  }
})();

function buildDuoQ(){
  return [
    {q:'¿Cómo suelen pasar su mejor tiempo juntos?',o:[{t:'Contándonos todo — horas de conversación',s:{fresa:3,vino:1}},{t:'En calma, sin necesidad de hacer nada especial',s:{vainilla:3,platano:1}},{t:'Explorando lugares o ideas nuevas',s:{menta:3,yuzu:1}},{t:'En conversaciones profundas que cambian algo',s:{choco:3,earl:1}},{t:'En planes espontáneos llenos de energía',s:{mango:3}},{t:'Creando o compartiendo arte y momentos estéticos',s:{lavanda:3,carda:1}},{t:'Cocinando, comiendo o en rituales compartidos',s:{chai:3,miel:1}},{t:'Recordando — el pasado compartido es parte de nosotros',s:{platano:3,higo:1}}]},
    {q:'Cuando hay un conflicto entre ustedes, generalmente...',o:[{t:'Lo hablamos enseguida, aunque sea difícil',s:{fresa:3,miel:1}},{t:'Esperamos a estar calmados antes de hablar',s:{vainilla:3,matcha:1}},{t:'Analizamos qué pasó y buscamos solución juntos',s:{menta:3,earl:1}},{t:'Necesitamos tiempo por separado para procesar',s:{choco:3,lavanda:1}},{t:'Lo superamos rápido — no nos quedamos en el conflicto',s:{mango:3,yuzu:1}},{t:'Lo expresamos de formas indirectas — gestos, silencios',s:{lavanda:3,carda:1}},{t:'Le damos espacio sin alejarnos del todo',s:{higo:3,vainilla:1}},{t:'Con humor — es nuestra forma de descomprimir',s:{mango:3,caramelo:1}}]},
    {q:'Lo que más une a los dos es...',o:[{t:'La intensidad de lo que sentimos uno por el otro',s:{fresa:3,vino:1}},{t:'La confianza y la estabilidad que nos damos',s:{vainilla:3,platano:1}},{t:'Las conversaciones que nos hacen crecer',s:{menta:3,earl:1}},{t:'La profundidad — nos conocemos de verdad',s:{choco:3}},{t:'La energía y el entusiasmo que compartimos',s:{mango:3,yuzu:1}},{t:'La sensibilidad — nos entendemos sin explicar',s:{lavanda:3,carda:1}},{t:'La calidez — siempre hay un lugar donde caer',s:{chai:3,miel:1}},{t:'La historia compartida y la memoria',s:{platano:3,higo:1}}]},
    {q:'Cuando uno de los dos está mal, el otro generalmente...',o:[{t:'Se acerca, abraza y está presente emocionalmente',s:{fresa:3,miel:1}},{t:'Da espacio pero se asegura que sepa que está ahí',s:{vainilla:3}},{t:'Trata de entender y ayuda a encontrar soluciones',s:{menta:3,earl:1}},{t:'Escucha profundo sin juzgar y acompaña en silencio',s:{choco:3,lavanda:1}},{t:'Busca distraer o animar con algo que lo saque del estado',s:{mango:3,yuzu:1}},{t:'Crea un ambiente de calma — música, detalle, presencia suave',s:{lavanda:3,carda:1}},{t:'Prepara algo de comer o un gesto concreto de cuidado',s:{chai:3,miel:1}},{t:'Cuenta historias o recuerdos compartidos para reconectar',s:{platano:3,higo:1}}]},
    {q:'¿Cómo es la comunicación entre ustedes principalmente?',o:[{t:'Muy emocional — nos decimos lo que sentimos',s:{fresa:3}},{t:'Tranquila y estable — rara vez hay drama innecesario',s:{vainilla:3,matcha:1}},{t:'Intelectual — hablamos mucho y de todo',s:{menta:3,earl:1}},{t:'Intensa y real — cuando hablamos, hablamos de verdad',s:{choco:3,vino:1}},{t:'Ligera y fluida — nos reímos mucho y todo fluye',s:{mango:3,yuzu:1}},{t:'Sutil — a veces no necesitamos palabras',s:{lavanda:3,carda:1}},{t:'Sabia — siempre hay algo que aprender del otro',s:{chai:3,higo:1}},{t:'Nostálgica — a menudo volvemos a recuerdos',s:{platano:3,fresa:1}}]},
    {q:'Si tuvieran que describir su energía juntos en una imagen, sería...',o:[{t:'Una hoguera — cálida, intensa, que atrae a todos',s:{fresa:3,vino:1}},{t:'Un lago tranquilo al atardecer — sereno y sin prisa',s:{vainilla:3,matcha:1}},{t:'Un café lleno de ideas — siempre algo interesante',s:{menta:3,earl:1}},{t:'El océano de noche — profundo, con mucho adentro',s:{choco:3}},{t:'Un día de playa con sol — alegre y sin preocupaciones',s:{mango:3,yuzu:1}},{t:'Un jardín en la madrugada — silencioso y lleno de detalles',s:{lavanda:3,carda:1}},{t:'Una mesa compartida — cálida, especiada, acogedora',s:{chai:3,miel:1}},{t:'Un álbum de fotos viejas — con historia y con peso',s:{platano:3,higo:1}}]},
    {q:'¿Cuál es su mayor reto como dúo?',o:[{t:'No dejarnos llevar demasiado por las emociones',s:{fresa:3}},{t:'Salir de la zona de confort y atrevernos a más',s:{vainilla:3,higo:1}},{t:'Bajar el ritmo mental y simplemente estar',s:{menta:3,earl:1}},{t:'Abrirse al mundo — a veces nuestra burbuja es muy cerrada',s:{choco:3}},{t:'Profundizar — a veces la alegría evita lo difícil',s:{mango:3,yuzu:1}},{t:'Comunicar más directo — lo sutil no siempre se entiende',s:{lavanda:3,carda:1}},{t:'Dejar espacio al cambio — nos aferramos a lo que fue',s:{platano:3,chai:1}},{t:'Equilibrarnos — a veces uno da más que el otro',s:{miel:3,vainilla:1}}]},
    {q:'¿Qué los hace únicos como dúo?',o:[{t:'La forma en que nos queremos — pocos lo tienen así',s:{fresa:3,vino:1}},{t:'La calma que nos damos — somos el descanso uno del otro',s:{vainilla:3,platano:1}},{t:'La estimulación mutua — siempre hay algo nuevo que aprender',s:{menta:3,yuzu:1}},{t:'La profundidad — nos conocemos en capas que otros no ven',s:{choco:3,earl:1}},{t:'La energía — con nosotros siempre es un buen momento',s:{mango:3}},{t:'La sensibilidad compartida — nos entendemos sin hablar',s:{lavanda:3,carda:1}},{t:'La calidez — cualquiera que nos ve siente el cuidado',s:{chai:3,miel:1}},{t:'La historia — hemos construido algo que muy pocos tienen',s:{platano:3,higo:1}}]},
    {q:'Una palabra para describir lo que son juntos:',o:[{t:'Intensidad',s:{fresa:3,vino:1}},{t:'Serenidad',s:{vainilla:3,matcha:1}},{t:'Crecimiento',s:{menta:3,yuzu:1}},{t:'Profundidad',s:{choco:3,earl:1}},{t:'Alegría',s:{mango:3}},{t:'Sensibilidad',s:{lavanda:3,carda:1}},{t:'Calidez',s:{chai:3,miel:1}},{t:'Raíces',s:{platano:3,higo:1}}]},
    {q:'¿Cómo quieren que los recuerden juntos?',o:[{t:'Como los que más se amaron',s:{fresa:3,vino:1}},{t:'Como los que siempre estaban ahí',s:{vainilla:3,platano:1}},{t:'Como los que siempre tenían algo fascinante que decir',s:{menta:3,yuzu:1}},{t:'Como los que tenían algo profundo que pocos entendían',s:{choco:3,earl:1}},{t:'Como los que hacían cualquier momento memorable',s:{mango:3}},{t:'Como los que hacían sentir la belleza del mundo',s:{lavanda:3,carda:1}},{t:'Como los que siempre tenían lugar para todos',s:{chai:3,miel:1}},{t:'Como los que construyeron algo que duró',s:{platano:3,higo:1}}]}
  ];
}

// ════════ STATE ════════
let cName='', scores={}, curQ=0, hist=[], rKey='', testMode='p';
let dN1='', dN2='', dVin='', dScores={}, dScores1={}, dScores2={}, dCurQ=0, dHist=[], dRKey='', dQuestions=[];
function mkScores(){
  const s={};
  // Solo inicializar sabores activos según NivDB
  const activosDB = typeof NivDB !== 'undefined' ? NivDB.getFlavors().filter(f=>f.activo).map(f=>f.id) : null;
  Object.keys(F).forEach(k=>{
    // Si NivDB está disponible, solo incluir activos; si no, incluir todos
    if(!activosDB || activosDB.includes(k)) s[k]=0;
  });
  return s;
}

// ════════ WEB NAV ════════
function scrollById(id){const el=document.getElementById(id);if(el)el.scrollIntoView({behavior:'smooth'});}
function launchKiosco(mode){
  document.body.classList.add('kiosco-mode');
  document.getElementById('kiosco-overlay').style.display='flex';
  if(mode==='solo-p') setTimeout(()=>kGo('name-p'),50);
  else if(mode==='solo-t') setTimeout(()=>kGo('name-t'),50);
  else if(mode==='duo') setTimeout(()=>kGo('duo-names'),50);
  else kGo('welcome');
}
function kExit(){
  document.body.classList.remove('kiosco-mode');
  document.getElementById('kiosco-overlay').style.display='none';
}

// ════════ KIOSCO NAV ════════
function kGo(p){
  document.querySelectorAll('.ks').forEach(s=>s.classList.remove('active'));
  const el=document.getElementById('ks-'+p);
  if(el){el.classList.add('active');el.scrollTop=0;}
  const steps={welcome:'',mode:'Elige tu modo','name-p':'Test de personalidad','name-t':'Estado de ánimo','duo-names':'Modo Dúo',quiz:'Respondiendo...',loading:'Analizando...','duo-quiz':'Dúo — Respondiendo...','duo-loading':'Analizando...','result':'Tu resultado','duo-result':'Su resultado compartido',ticket:'Tu ticket','duo-ticket':'Ticket Dúo'};
  document.getElementById('kStep').textContent=steps[p]||'';
}

// ════════ SOLO FLOW ════════
function startSolo(mode){
  testMode=mode;
  const inputId=mode==='p'?'nameP':'nameT';
  const raw=document.getElementById(inputId).value.trim();
  cName=raw||'Invitado/a';
  scores=mkScores(); curQ=0; hist=[];
  kGo('quiz'); renderQ();
}
function renderQ(){
  const qs=testMode==='p'?QP:QT;
  const q=qs[curQ];
  const pct=(curQ/qs.length*100);
  document.getElementById('kqFill').style.width=pct+'%';
  document.getElementById('kqLabel').textContent=testMode==='p'?'¿Qué nieve eres?':'¿Cómo te sientes hoy?';
  document.getElementById('kqCount').textContent=(curQ+1)+' / '+qs.length;
  document.getElementById('kqHi').textContent=curQ===0?'Hola, '+cName+' 👋':'';
  document.getElementById('kqQ').textContent=q.q;
  const g=document.getElementById('kqOpts'); g.innerHTML='';
  q.o.forEach(o=>{
    const b=document.createElement('button'); b.className='kq-opt';
    b.innerHTML=`<span class="kq-dot"></span>${o.t}`;
    b.onclick=()=>pickSolo(o,b,qs); g.appendChild(b);
  });
  document.getElementById('kQW').scrollTop=0;
}
function pickSolo(o,btn,qs){
  document.querySelectorAll('#kqOpts .kq-opt').forEach(b=>b.classList.remove('sel'));
  btn.classList.add('sel');
  hist.push({q:curQ,scores:{...scores}});
  Object.entries(o.s).forEach(([k,v])=>{if(scores[k]!==undefined)scores[k]+=v;});
  setTimeout(()=>{
    curQ++;
    if(curQ<qs.length){const w=document.getElementById('kQW');w.style.opacity='0';w.style.transition='opacity .12s';setTimeout(()=>{renderQ();w.style.opacity='1';},120);}
    else runLoad('solo');
  },230);
}
function goBack(type){
  if(type==='solo'){
    if(hist.length===0){kGo(testMode==='p'?'name-p':'name-t');return;}
    const prev=hist.pop(); curQ=prev.q; scores={...prev.scores}; renderQ();
  } else {
    if(dHist.length===0){kGo('duo-names');return;}
    const prev=dHist.pop(); dCurQ=prev.q; dScores={...prev.scores}; dScores1={...prev.s1}; dScores2={...prev.s2}; renderDuoQ();
  }
}

// ════════ DUO FLOW ════════
function kSelV(key){dVin=key;document.querySelectorAll('.kvc').forEach(c=>c.classList.remove('sel'));document.getElementById('kv-'+key).classList.add('sel');}
function startDuo(){
  const n1=document.getElementById('dN1').value.trim();
  const n2=document.getElementById('dN2').value.trim();
  dN1=n1||'Persona 1'; dN2=n2||'Persona 2';
  if(!dVin){alert('Selecciona el tipo de vínculo');return;}
  dScores=mkScores(); dScores1=mkScores(); dScores2=mkScores(); dCurQ=0; dHist=[];
  dQuestions=buildDuoQ();
  const v=VINCULOS[dVin]||VINCULOS.otro;
  document.getElementById('kDBanner').textContent=dN1+' & '+dN2;
  document.getElementById('kDType').textContent=v.icon+' '+v.label;
  kGo('duo-quiz'); renderDuoQ();
}
function renderDuoQ(){
  const q=dQuestions[dCurQ];
  document.getElementById('kdqFill').style.width=(dCurQ/dQuestions.length*100)+'%';
  document.getElementById('kdqCount').textContent=(dCurQ+1)+' / '+dQuestions.length;
  document.getElementById('kdqQ').textContent=q.q;
  const g=document.getElementById('kdqOpts'); g.innerHTML='';
  q.o.forEach(o=>{
    const b=document.createElement('button'); b.className='kq-opt';
    b.innerHTML=`<span class="kq-dot"></span>${o.t}`;
    b.onclick=()=>pickDuo(o,b); g.appendChild(b);
  });
  document.getElementById('kdQW').scrollTop=0;
}
function pickDuo(o,btn){
  document.querySelectorAll('#kdqOpts .kq-opt').forEach(b=>b.classList.remove('sel'));
  btn.classList.add('sel');
  dHist.push({q:dCurQ,scores:{...dScores},s1:{...dScores1},s2:{...dScores2}});
  Object.entries(o.s).forEach(([k,v])=>{
    if(dScores[k]!==undefined) dScores[k]+=v;
    // Split: odd questions bias P1, even bias P2 (for compat calc)
    if(dCurQ%2===0){if(dScores1[k]!==undefined) dScores1[k]+=v;}
    else{if(dScores2[k]!==undefined) dScores2[k]+=v;}
  });
  setTimeout(()=>{
    dCurQ++;
    if(dCurQ<dQuestions.length){const w=document.getElementById('kdQW');w.style.opacity='0';w.style.transition='opacity .12s';setTimeout(()=>{renderDuoQ();w.style.opacity='1';},120);}
    else runLoad('duo');
  },230);
}

// ════════ LOAD ANIM ════════
function runLoad(type){
  if(type==='solo'){
    // Filtrar sabores inactivos antes de determinar el resultado
    const activosIds = typeof NivDB !== 'undefined' ? NivDB.getFlavors().filter(f=>f.activo).map(f=>f.id) : Object.keys(F);
    const scoresActivos = Object.fromEntries(Object.entries(scores).filter(([k])=>activosIds.includes(k)));
    const entradas = Object.entries(scoresActivos).filter(([,v])=>v>0);
    rKey = (entradas.length > 0 ? entradas : Object.entries(scoresActivos)).sort((a,b)=>b[1]-a[1])[0][0];
    kGo('loading');
    document.getElementById('klN').textContent=cName;
    document.getElementById('klSub').textContent=testMode==='p'?'encontrando tu nieve ideal':'analizando cómo te sientes hoy';
    animLoad('klF','klM',()=>showResult('solo'));
  } else {
    const activosIdsDuo = typeof NivDB !== 'undefined' ? NivDB.getFlavors().filter(f=>f.activo).map(f=>f.id) : Object.keys(F);
    const dScoresActivos = Object.fromEntries(Object.entries(dScores).filter(([k])=>activosIdsDuo.includes(k)));
    const dEntradas = Object.entries(dScoresActivos).filter(([,v])=>v>0);
    dRKey = (dEntradas.length > 0 ? dEntradas : Object.entries(dScoresActivos)).sort((a,b)=>b[1]-a[1])[0][0];
    kGo('duo-loading');
    document.getElementById('kdlN').textContent=dN1+' & '+dN2;
    animLoad('kdlF','kdlM',()=>showResult('duo'));
  }
}
function animLoad(fillId,msgId,cb){
  const msgs=['Evaluando respuestas...','Mezclando sabores...','Preparando resultado...','Casi listo...'];
  let mi=0;
  const ti=setInterval(()=>{document.getElementById(msgId).textContent=msgs[mi%msgs.length];mi++;},680);
  const fill=document.getElementById(fillId); let p=0;
  const bi=setInterval(()=>{p+=1.8;fill.style.width=p+'%';if(p>=100){clearInterval(bi);clearInterval(ti);setTimeout(cb,280);}},24);
}

// ════════ RESULTS ════════
function showResult(type){
  if(type==='solo'){
    const f=F[rKey]; kGo('result');
    const hero=document.getElementById('krH');
    hero.className='kr-hero fi '+f.cls;
    hero.style.setProperty('--c',f.c); hero.style.setProperty('--c2',f.c2);
    document.getElementById('krO').textContent=testMode==='p'?f.name.toUpperCase():'TU ESTADO DE HOY';
    document.getElementById('krW').textContent=cName+',';
    document.getElementById('krN').textContent=f.name;
    document.getElementById('krP').textContent=f.persona;
    document.getElementById('krD').textContent=f.desc;
    document.getElementById('krTr').innerHTML=f.traits.map(t=>`<div class="kr-cell"><div class="kr-cl">${t.l}</div><div class="kr-cv">${t.v}</div></div>`).join('');
    document.getElementById('krIT').textContent=f.ins.tag;
    document.getElementById('krITx').textContent=f.ins.text;
    document.getElementById('krIH').innerHTML=`<p>${f.ins.hl}</p>`;
    document.getElementById('krBR').textContent=f.base.rec;
    document.getElementById('krBRD').textContent=f.base.recD;
    document.getElementById('krBA').textContent=f.base.alt;
    document.getElementById('krBAD').textContent=f.base.altD;
    document.getElementById('krAl').innerHTML=buildAl(f);
    document.getElementById('krPsy').textContent=f.psych;
    document.getElementById('krTips').innerHTML=f.tips.map((t,i)=>`<div class="kr-tr"><span class="kr-tn">0${i+1}</span><div class="kr-tt">${t.t}</div></div>`).join('');
    document.getElementById('krTkN').textContent=cName;
    // Share card solo
    document.getElementById('ssFlavor').textContent=f.name;
    document.getElementById('ssPer').textContent=f.persona;
    document.getElementById('ssHl').textContent=f.ins.hl;
    document.getElementById('shareSoloGlow').style.background=`radial-gradient(ellipse 80% 70% at 50% 30%, ${f.c} 0%, transparent 70%)`;
    // ── Guardar en NivDB ──
    if(typeof NivDB !== 'undefined'){
      NivDB.save({
        modo: testMode === 'p' ? 'solo' : 'estado',
        flavorId: rKey,
        sabor: f.name,
        flavorColor: f.c.replace('var(--','').replace(')',''),
        nombre1: cName,
      });
    }
    document.getElementById('ks-result').scrollTop=0;
  } else {
    const f=F[dRKey]; kGo('duo-result');
    const v=VINCULOS[dVin]||VINCULOS.otro;
    const hero=document.getElementById('kdrH');
    hero.className='kr-hero fi '+f.cls;
    hero.style.setProperty('--c',f.c); hero.style.setProperty('--c2',f.c2);
    document.getElementById('kdrO').textContent=v.icon+' '+v.label.toUpperCase();
    document.getElementById('kdrW').textContent=dN1+' & '+dN2;
    document.getElementById('kdrAll').textContent=DUO_ALL[dRKey]||'';
    document.getElementById('kdrN').textContent=f.name;
    document.getElementById('kdrP').textContent='Su sabor compartido';
    document.getElementById('kdrD').textContent=f.desc;
    document.getElementById('kdrTr').innerHTML=f.traits.map(t=>`<div class="kr-cell"><div class="kr-cl">${t.l}</div><div class="kr-cv">${t.v}</div></div>`).join('');
    document.getElementById('kdrIT').textContent=f.ins.tag;
    document.getElementById('kdrITx').textContent=f.ins.text;
    document.getElementById('kdrIH').innerHTML=`<p>${f.ins.hl}</p>`;
    document.getElementById('kdrTip').textContent=DUO_TIP[dRKey]||'';
    document.getElementById('kdrBR').textContent=f.base.rec;
    document.getElementById('kdrBRD').textContent=f.base.recD;
    document.getElementById('kdrBA').textContent=f.base.alt;
    document.getElementById('kdrBAD').textContent=f.base.altD;
    document.getElementById('kdrAl').innerHTML=buildAl(f);
    document.getElementById('kdrTkN').textContent=dN1+' & '+dN2;
    // Compat meter
    const compat=calcCompat(dScores1,dScores2);
    populateCompat(compat);
    // Share card duo
    document.getElementById('sdFlavor').textContent=f.name;
    document.getElementById('sdAlliance').textContent=DUO_ALL[dRKey]||f.persona;
    document.getElementById('sdHl').textContent=f.ins.hl;
    document.getElementById('sdCompat').textContent='💞 Compatibilidad: '+compat+'%';
    document.getElementById('shareDuoGlow').style.background=`radial-gradient(ellipse 80% 70% at 50% 30%, ${f.c} 0%, transparent 70%)`;
    // ── Guardar en NivDB ──
    if(typeof NivDB !== 'undefined'){
      const compat=calcCompat(dScores1,dScores2);
      NivDB.save({
        modo: 'duo',
        flavorId: dRKey,
        sabor: f.name,
        flavorColor: f.c.replace('var(--','').replace(')',''),
        nombre1: dN1,
        nombre2: dN2,
        compat: compat,
      });
    }
    document.getElementById('ks-duo-result').scrollTop=0;
  }
}

// ════════ TICKET ════════
function showTicket(type){
  const now=new Date();
  const ds=now.toLocaleDateString('es-MX',{day:'2-digit',month:'long',year:'numeric'})+' · '+now.toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit'});
  const folio='NP-'+now.getFullYear().toString().slice(-2)+String(now.getMonth()+1).padStart(2,'0')+String(now.getDate()).padStart(2,'0')+'-'+String(Math.floor(Math.random()*9999)).padStart(4,'0');
  const bc=Array.from({length:38},()=>Math.random()>.5?'|':' ').join('');
  if(type==='solo'){
    const f=F[rKey];
    document.getElementById('tkN').textContent=cName;
    document.getElementById('tkDate').textContent=ds;
    document.getElementById('tkMlbl').textContent=testMode==='p'?'Tu nieve es':'Tu nieve de hoy';
    document.getElementById('tkF').textContent=f.name;
    document.getElementById('tkPer').textContent=f.persona;
    document.getElementById('tkHL').textContent=f.ins.hl;
    document.getElementById('tkBase').textContent='Preparado artesanalmente';
    document.getElementById('tkBaseN').textContent='Elaborado con ingredientes seleccionados. Consulta alérgenos en caja.';
    document.getElementById('tkFolio').textContent=folio;
    document.getElementById('tkBC').textContent=bc;
    document.getElementById('tkAl').innerHTML=buildAlPills(f);
    kGo('ticket');
  } else {
    const f=F[dRKey]; const v=VINCULOS[dVin]||VINCULOS.otro;
    document.getElementById('dkVlbl').textContent=v.icon+' '+v.label;
    document.getElementById('dkNames').textContent=dN1+' & '+dN2;
    document.getElementById('dkDate').textContent=ds;
    document.getElementById('dkF').textContent=f.name;
    document.getElementById('dkAll').textContent=DUO_ALL[dRKey]||'';
    document.getElementById('dkHL').textContent=f.ins.hl;
    document.getElementById('dkBase').textContent='Preparado artesanalmente';
    document.getElementById('dkBaseN').textContent='Elaborado con ingredientes seleccionados. Consulta alérgenos en caja.';
    document.getElementById('dkFolio').textContent=folio;
    document.getElementById('dkBC').textContent=bc;
    document.getElementById('dkAl').innerHTML=buildAlPills(f);
    kGo('duo-ticket');
  }
}

// ════════ CATALOG ════════
function buildCatalog(){
  const g=document.getElementById('flavorsGrid');
  if(!g) return;
  // Filtrar sabores inactivos
  const activosIds = typeof NivDB !== 'undefined' ? NivDB.getFlavors().filter(f=>f.activo).map(f=>f.id) : Object.keys(F);
  const activeEntries = Object.entries(F).filter(([k])=>activosIds.includes(k));
  g.innerHTML=activeEntries.map(([k,f])=>`
    <div class="fc ${f.cls}" data-base="${f.baseType}" data-lacteos="${f.allergens.lacteos}" data-frutos="${f.allergens.frutosSecs}" style="--c:${f.c};--c2:${f.c2}">
      <div class="fc-top"><div class="fc-name">${f.name}</div><div class="fc-persona">${f.persona}</div></div>
      <div class="fc-body">
        <div class="fc-desc">${f.desc}</div>
        <div class="fc-tags">${f.traits.map(t=>`<span class="fc-tag">${t.l}</span>`).join('')}</div>
        <div class="fc-base-line"><span class="fc-base-dot"></span>Base: ${f.base.rec}</div>
        <div class="fc-al-row">${AL_META.map(a=>`<span class="fc-al ${f.allergens[a.key]?'has':'free'}">${a.label}: ${f.allergens[a.key]?'✓':'—'}</span>`).join('')}</div>
      </div>
    </div>`).join('');
}
function filterF(type,btn){
  document.querySelectorAll('.fpill').forEach(p=>p.classList.remove('on'));
  btn.classList.add('on');
  document.querySelectorAll('.fc').forEach(c=>{
    let show=true;
    if(type==='agua') show=c.dataset.base==='agua';
    else if(type==='leche') show=c.dataset.base==='leche'||c.dataset.base==='ambas';
    else if(type==='sin-lacteos') show=c.dataset.lacteos==='false';
    else if(type==='sin-frutos') show=c.dataset.frutos==='false';
    c.style.display=show?'':'none';
  });
}

// ════════ HELPERS ════════
function buildAl(f){return AL_META.map(a=>{const has=f.allergens[a.key];const note=f.allergenNotes[a.key]||'';return`<div class="kr-ali ${has?'has':'free'}"><div class="kr-aln">${a.label}</div><div class="kr-als">${has?'Contiene':'Sin'}</div>${note?`<div class="kr-alnote">${note}</div>`:''}</div>`;}).join('');}
function buildAlPills(f){return AL_META.map(a=>`<span class="tk-ap ${f.allergens[a.key]?'has':'free'}">${a.label} ${f.allergens[a.key]?'✓':'—'}</span>`).join('');}

// ════════ COMPATIBILITY ════════
// Flavor affinity matrix — pairs that naturally complement or contrast
const AFFINITY={
  fresa:{fresa:95,vainilla:72,menta:65,choco:78,mango:88,lavanda:82,matcha:60,miel:90,higo:68,caramelo:75,yuzu:70,earl:58,chai:85,platano:80,vino:92,carda:76},
  vainilla:{fresa:72,vainilla:95,menta:78,choco:70,mango:65,lavanda:74,matcha:85,miel:80,higo:82,caramelo:68,yuzu:60,earl:88,chai:76,platano:86,vino:64,carda:70},
  menta:{fresa:65,vainilla:78,menta:95,choco:72,mango:80,lavanda:68,matcha:82,miel:62,higo:66,caramelo:70,yuzu:90,earl:85,chai:60,platano:58,vino:64,carda:62},
  choco:{fresa:78,vainilla:70,menta:72,choco:95,mango:68,lavanda:74,matcha:76,miel:72,higo:80,caramelo:82,yuzu:62,earl:78,chai:75,platano:72,vino:88,carda:80},
  mango:{fresa:88,vainilla:65,menta:80,choco:68,mango:95,lavanda:70,matcha:64,miel:85,higo:60,caramelo:86,yuzu:92,earl:62,chai:78,platano:74,vino:66,carda:68},
  lavanda:{fresa:82,vainilla:74,menta:68,choco:74,mango:70,lavanda:95,matcha:78,miel:76,higo:72,caramelo:66,yuzu:74,earl:80,chai:70,platano:68,vino:76,carda:92},
  matcha:{fresa:60,vainilla:85,menta:82,choco:76,mango:64,lavanda:78,matcha:95,miel:70,higo:80,caramelo:72,yuzu:82,earl:88,chai:68,platano:72,vino:66,carda:74},
  miel:{fresa:90,vainilla:80,menta:62,choco:72,mango:85,lavanda:76,matcha:70,miel:95,higo:78,caramelo:74,yuzu:68,earl:65,chai:92,platano:86,vino:70,carda:72},
  higo:{fresa:68,vainilla:82,menta:66,choco:80,mango:60,lavanda:72,matcha:80,miel:78,higo:95,caramelo:70,yuzu:60,earl:82,chai:80,platano:88,vino:76,carda:74},
  caramelo:{fresa:75,vainilla:68,menta:70,choco:82,mango:86,lavanda:66,matcha:72,miel:74,higo:70,caramelo:95,yuzu:84,earl:68,chai:72,platano:70,vino:80,carda:64},
  yuzu:{fresa:70,vainilla:60,menta:90,choco:62,mango:92,lavanda:74,matcha:82,miel:68,higo:60,caramelo:84,yuzu:95,earl:78,chai:64,platano:58,vino:62,carda:70},
  earl:{fresa:58,vainilla:88,menta:85,choco:78,mango:62,lavanda:80,matcha:88,miel:65,higo:82,caramelo:68,yuzu:78,earl:95,chai:70,platano:74,vino:72,carda:78},
  chai:{fresa:85,vainilla:76,menta:60,choco:75,mango:78,lavanda:70,matcha:68,miel:92,higo:80,caramelo:72,yuzu:64,earl:70,chai:95,platano:88,vino:74,carda:80},
  platano:{fresa:80,vainilla:86,menta:58,choco:72,mango:74,lavanda:68,matcha:72,miel:86,higo:88,caramelo:70,yuzu:58,earl:74,chai:88,platano:95,vino:70,carda:68},
  vino:{fresa:92,vainilla:64,menta:64,choco:88,mango:66,lavanda:76,matcha:66,miel:70,higo:76,caramelo:80,yuzu:62,earl:72,chai:74,platano:70,vino:95,carda:82},
  carda:{fresa:76,vainilla:70,menta:62,choco:80,mango:68,lavanda:92,matcha:74,miel:72,higo:74,caramelo:64,yuzu:70,earl:78,chai:80,platano:68,vino:82,carda:95}
};
function calcCompat(s1,s2){
  // Safe sort — fallback to dRKey if scores empty
  const sorted1=Object.entries(s1).filter(e=>e[1]>0).sort((a,b)=>b[1]-a[1]);
  const sorted2=Object.entries(s2).filter(e=>e[1]>0).sort((a,b)=>b[1]-a[1]);
  const k1=sorted1.length>0?sorted1[0][0]:dRKey;
  const k2=sorted2.length>0?sorted2[0][0]:dRKey;
  const base=(AFFINITY[k1]&&AFFINITY[k1][k2])?AFFINITY[k1][k2]:75;
  return Math.min(99,Math.max(40,base+Math.floor(Math.random()*10)-5));
}
let lastCompat=0;
function populateCompat(pct){
  lastCompat=pct;
  const compatEl=document.getElementById('compatPct');
  if(compatEl) compatEl.textContent=pct;
  // Animate ring: circumference = 2π×53 ≈ 333
  const circumference=333;
  const offset=circumference-(pct/100*circumference);
  const ring=document.getElementById('compatRing');
  // Color by range
  let color,verdict,desc;
  if(pct>=90){color='#4a9068';verdict='Conexión perfecta 🌟';desc='Raramente se encuentran dos perfiles que encajen así. Su combinación es naturalmente armoniosa.'}
  else if(pct>=70){color='#c4786a';verdict='Gran química 💞';desc='Tienen una compatibilidad real y profunda. Sus diferencias se complementan en lugar de chocar.'}
  else if(pct>=50){color='#a07828';verdict='Contraste interesante ✨';desc='Son distintos en formas que generan tensión creativa. Eso puede ser exactamente lo que se necesitan.'}
  else{color='#582858';verdict='Sabores opuestos 🌶';desc='La intensidad del contraste entre ustedes es inusual. A veces los opuestos son la combinación más memorable.'}
  ring.setAttribute('stroke',color);
  setTimeout(()=>{ring.style.strokeDashoffset=offset;},100);
  document.getElementById('compatVerdict').textContent=verdict;
  document.getElementById('compatDesc').textContent=desc;
  // Individual flavors for display
  const sorted1=Object.entries(dScores1).filter(e=>e[1]>0).sort((a,b)=>b[1]-a[1]);
  const sorted2=Object.entries(dScores2).filter(e=>e[1]>0).sort((a,b)=>b[1]-a[1]);
  const k1=sorted1.length>0?sorted1[0][0]:dRKey;
  const k2=sorted2.length>0?sorted2[0][0]:dRKey;
  document.getElementById('compatF1').textContent=F[k1]?.name||F[dRKey].name;
  document.getElementById('compatF2').textContent=F[k2]?.name||F[dRKey].name;
}

// ════════ SHARE CANVAS ════════
let shareMode='solo';
const FLAVOR_EMOJI={fresa:'🍓',vainilla:'🍦',menta:'🌿',choco:'🍫',mango:'🥭',lavanda:'💜',matcha:'🍵',miel:'🍯',higo:'🫐',caramelo:'🧁',yuzu:'🍋',earl:'☕',chai:'🌶',platano:'🍌',vino:'🍷',carda:'🌹'};

function openShare(mode){
  shareMode=mode;
  const canvas=document.getElementById('shareCanvas');
  if(!canvas) return;
  const ctx=canvas.getContext('2d');
  canvas.width=1080; canvas.height=1920;
  if(mode==='solo') drawSoloCard(ctx,canvas);
  else drawDuoCard(ctx,canvas);
  document.getElementById('shareOverlay').classList.add('show');
}
function closeShare(){document.getElementById('shareOverlay').classList.remove('show');}

function hexToRgb(hex){const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);return`${r},${g},${b}`;}
// CSS var to hex map for canvas
const C2H={
  'var(--rose)':'#f0d8d0','var(--rose2)':'#c4786a','var(--gold)':'#f0e4b8','var(--gold2)':'#a07828',
  'var(--mint)':'#d0e8dc','var(--mint2)':'#4a9068','var(--lav)':'#e0d4f0','var(--lav2)':'#7050b0',
  'var(--mocha)':'#dfd0bc','var(--mocha2)':'#7a5030','var(--peach)':'#fce0c0','var(--peach2)':'#b85828',
  'var(--teal)':'#c4e4dc','var(--teal2)':'#386e60','var(--amber)':'#f4dca0','var(--amber2)':'#b87018',
  'var(--fig)':'#d8c4bc','var(--fig2)':'#884038','var(--caramel)':'#ecd4a0','var(--caramel2)':'#a86818',
  'var(--yuzu)':'#e4edb8','var(--yuzu2)':'#648818','var(--earl)':'#d4e0ec','var(--earl2)':'#385898',
  'var(--chai)':'#e4ccb0','var(--chai2)':'#884020','var(--platano)':'#ede4b8','var(--platano2)':'#786018',
  'var(--vino)':'#ccb4c4','var(--vino2)':'#582858','var(--carda)':'#ecd0e4','var(--carda2)':'#885070'
};
function cv(cssVar){return C2H[cssVar]||'#c4786a';}
function wrapText(ctx,text,x,y,maxWidth,lineHeight){
  const words=text.split(' '); let line=''; const lines=[];
  for(let w of words){const t=line?line+' '+w:w;if(ctx.measureText(t).width>maxWidth&&line){lines.push(line);line=w;}else line=t;}
  lines.push(line);
  lines.forEach((l,i)=>ctx.fillText(l,x,y+i*lineHeight));
  return lines.length;
}

function drawSoloCard(ctx,canvas){
  const f=F[rKey];
  const bgColor=cv(f.c); const acColor=cv(f.c2);
  const W=canvas.width, H=canvas.height;
  // Background
  ctx.fillStyle='#18120e'; ctx.fillRect(0,0,W,H);
  // Glow blob
  const grd=ctx.createRadialGradient(W*.6,H*.2,0,W*.6,H*.2,W*.75);
  grd.addColorStop(0,bgColor+'55'); grd.addColorStop(1,'transparent');
  ctx.fillStyle=grd; ctx.fillRect(0,0,W,H);
  // Top accent line
  ctx.fillStyle=acColor; ctx.fillRect(0,0,W,8);
  // LOGO
  ctx.font='bold 52px serif'; ctx.fillStyle='#f9f6f1';
  ctx.textAlign='center'; ctx.fillText("NIV'POP",W/2,120);
  // Label
  ctx.font='300 32px sans-serif'; ctx.fillStyle=acColor+'cc';
  ctx.fillText('Tu perfil de nieve',W/2,185);
  // Divider
  ctx.strokeStyle=acColor+'44'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(W*.15,215); ctx.lineTo(W*.85,215); ctx.stroke();
  // Emoji
  const emoji=FLAVOR_EMOJI[rKey]||'🍦';
  ctx.font='180px serif'; ctx.fillStyle='#fff';
  ctx.fillText(emoji,W/2,440);
  // Flavor name
  ctx.font='bold 80px serif'; ctx.fillStyle='#f9f6f1';
  ctx.fillText(f.name,W/2,560);
  // Persona
  ctx.font='italic 44px serif'; ctx.fillStyle=acColor;
  ctx.fillText(f.persona,W/2,640);
  // Divider
  ctx.strokeStyle='rgba(255,255,255,.12)'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(W*.2,690); ctx.lineTo(W*.8,690); ctx.stroke();
  // Traits
  const traits=f.traits.slice(0,4);
  traits.forEach((t,i)=>{
    const col=i%2===0?W*.28:W*.72;
    const row=i<2?760:850;
    ctx.font='600 28px sans-serif'; ctx.fillStyle=acColor; ctx.textAlign='center';
    ctx.fillText(t.l,col,row);
    ctx.font='300 34px serif'; ctx.fillStyle='rgba(255,255,255,.8)';
    ctx.fillText(t.v,col,row+48);
  });
  ctx.textAlign='center';
  // Quote block
  ctx.fillStyle='rgba(255,255,255,.04)';
  ctx.beginPath(); ctx.roundRect(W*.08,950,W*.84,220,12); ctx.fill();
  ctx.strokeStyle=acColor+'33'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.roundRect(W*.08,950,W*.84,220,12); ctx.stroke();
  // Quote accent
  ctx.fillStyle=acColor; ctx.fillRect(W*.08,950,5,220);
  ctx.font='italic 38px serif'; ctx.fillStyle='rgba(255,255,255,.75)';
  wrapText(ctx,'"'+f.ins.hl+'"',W/2,1010,W*.74,56);
  // Description
  ctx.font='300 34px sans-serif'; ctx.fillStyle='rgba(255,255,255,.5)';
  wrapText(ctx,f.desc,W/2,1230,W*.78,50);
  // Bottom hashtag
  ctx.fillStyle=acColor+'66'; ctx.fillRect(0,H-160,W,1);
  ctx.font='600 36px sans-serif'; ctx.fillStyle='rgba(255,255,255,.3)';
  ctx.fillText('#NivPop   #QuéNieveEres',W/2,H-100);
  ctx.font='300 30px sans-serif'; ctx.fillStyle='rgba(255,255,255,.18)';
  ctx.fillText('nivpop.mx',W/2,H-50);
}

function drawDuoCard(ctx,canvas){
  const f=F[dRKey]; const v=VINCULOS[dVin]||VINCULOS.otro;
  const bgColor=cv(f.c); const acColor=cv(f.c2);
  const W=canvas.width, H=canvas.height;
  const sorted1=Object.entries(dScores1).filter(e=>e[1]>0).sort((a,b)=>b[1]-a[1]);
  const sorted2=Object.entries(dScores2).filter(e=>e[1]>0).sort((a,b)=>b[1]-a[1]);
  const k1=sorted1.length>0?sorted1[0][0]:dRKey;
  const k2=sorted2.length>0?sorted2[0][0]:dRKey;
  // Background
  ctx.fillStyle='#18120e'; ctx.fillRect(0,0,W,H);
  const grd=ctx.createRadialGradient(W/2,H*.25,0,W/2,H*.25,W*.8);
  grd.addColorStop(0,bgColor+'44'); grd.addColorStop(1,'transparent');
  ctx.fillStyle=grd; ctx.fillRect(0,0,W,H);
  // Top accent
  const topGrd=ctx.createLinearGradient(0,0,W,0);
  topGrd.addColorStop(0,'#c4786a'); topGrd.addColorStop(.5,'#7050b0'); topGrd.addColorStop(1,'#4a9068');
  ctx.fillStyle=topGrd; ctx.fillRect(0,0,W,8);
  // Logo
  ctx.font='bold 52px serif'; ctx.fillStyle='#f9f6f1'; ctx.textAlign='center';
  ctx.fillText("NIV'POP",W/2,120);
  // Vinculo
  ctx.font='36px sans-serif'; ctx.fillStyle=acColor+'cc';
  ctx.fillText(v.icon+' '+v.label,W/2,178);
  ctx.strokeStyle=acColor+'33'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(W*.15,205); ctx.lineTo(W*.85,205); ctx.stroke();
  // Names
  ctx.font='italic 52px serif'; ctx.fillStyle='rgba(255,255,255,.9)';
  ctx.fillText(dN1+' & '+dN2,W/2,285);
  // Individual flavor rows
  const f1=F[k1]||f; const f2=F[k2]||f;
  const e1=FLAVOR_EMOJI[k1]||'🍦'; const e2=FLAVOR_EMOJI[k2]||'🍦';
  // Card 1
  ctx.fillStyle=cv(f1.c)+'33';
  ctx.beginPath(); ctx.roundRect(60,320,W/2-80,180,10); ctx.fill();
  ctx.font='56px serif'; ctx.fillText(e1,W/4,410);
  ctx.font='italic 30px serif'; ctx.fillStyle='rgba(255,255,255,.6)';
  ctx.fillText(dN1,W/4,455);
  ctx.font='600 26px sans-serif'; ctx.fillStyle='rgba(255,255,255,.85)';
  const n1short=f1.name.length>14?f1.name.split(' ').slice(0,2).join(' '):f1.name;
  ctx.fillText(n1short,W/4,492);
  // Card 2
  ctx.fillStyle=cv(f2.c)+'33';
  ctx.beginPath(); ctx.roundRect(W/2+20,320,W/2-80,180,10); ctx.fill();
  ctx.font='56px serif'; ctx.fillText(e2,W*.75,410);
  ctx.font='italic 30px serif'; ctx.fillStyle='rgba(255,255,255,.6)';
  ctx.fillText(dN2,W*.75,455);
  ctx.font='600 26px sans-serif'; ctx.fillStyle='rgba(255,255,255,.85)';
  const n2short=f2.name.length>14?f2.name.split(' ').slice(0,2).join(' '):f2.name;
  ctx.fillText(n2short,W*.75,492);
  // Compat ring (drawn)
  const pct=lastCompat; const cx=W/2, cy=690, r=130, lw=16;
  const circ=2*Math.PI*r;
  // bg ring
  ctx.strokeStyle='rgba(255,255,255,.08)'; ctx.lineWidth=lw; ctx.lineCap='round';
  ctx.beginPath(); ctx.arc(cx,cy,r,0,2*Math.PI); ctx.stroke();
  // fill ring
  let ringColor=pct>=90?'#4a9068':pct>=70?'#c4786a':pct>=50?'#a07828':'#582858';
  const ringGrd=ctx.createLinearGradient(cx-r,cy,cx+r,cy);
  ringGrd.addColorStop(0,ringColor); ringGrd.addColorStop(1,ringColor+'aa');
  ctx.strokeStyle=ringGrd; ctx.lineWidth=lw;
  ctx.beginPath(); ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+(2*Math.PI*pct/100)); ctx.stroke();
  // pct text
  ctx.font='bold 110px serif'; ctx.fillStyle='#f9f6f1';
  ctx.fillText(pct+'%',cx,cy+38);
  ctx.font='italic 36px serif'; ctx.fillStyle=ringColor;
  const vc=pct>=90?'Conexión perfecta':pct>=70?'Gran química':pct>=50?'Contraste interesante':'Sabores opuestos';
  ctx.fillText(vc,cx,cy+98);
  // Shared flavor
  ctx.strokeStyle='rgba(255,255,255,.06)'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(W*.1,840); ctx.lineTo(W*.9,840); ctx.stroke();
  ctx.font='600 28px sans-serif'; ctx.fillStyle=acColor+'bb';
  ctx.fillText('SU NIEVE COMPARTIDA',cx,900);
  ctx.font='italic bold 68px serif'; ctx.fillStyle='#f9f6f1';
  ctx.fillText(f.name,cx,990);
  ctx.font='italic 36px serif'; ctx.fillStyle=acColor;
  ctx.fillText(DUO_ALL[dRKey]||'',cx,1050);
  // Divider
  ctx.strokeStyle='rgba(255,255,255,.06)'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(W*.1,1090); ctx.lineTo(W*.9,1090); ctx.stroke();
  // Quote
  ctx.fillStyle='rgba(255,255,255,.04)';
  ctx.beginPath(); ctx.roundRect(W*.07,1110,W*.86,200,10); ctx.fill();
  ctx.fillStyle=acColor; ctx.fillRect(W*.07,1110,5,200);
  ctx.font='italic 34px serif'; ctx.fillStyle='rgba(255,255,255,.7)';
  wrapText(ctx,'"'+f.ins.hl+'"',cx,1165,W*.76,50);
  // Tip
  ctx.font='300 30px sans-serif'; ctx.fillStyle='rgba(255,255,255,.45)';
  wrapText(ctx,DUO_TIP[dRKey]||'',cx,1360,W*.78,46);
  // Footer
  ctx.fillStyle=acColor+'55'; ctx.fillRect(0,H-170,W,1);
  ctx.font='600 36px sans-serif'; ctx.fillStyle='rgba(255,255,255,.3)';
  ctx.fillText('#NivPop   #SaborCompartido',cx,H-105);
  ctx.font='300 28px sans-serif'; ctx.fillStyle='rgba(255,255,255,.15)';
  ctx.fillText('nivpop.mx',cx,H-55);
}

function downloadShare(){
  const canvas=document.getElementById('shareCanvas');
  if(!canvas) return;
  const a=document.createElement('a');
  a.href=canvas.toDataURL('image/png');
  a.download=shareMode==='solo'?`nivpop-${rKey}.png`:`nivpop-duo-${dRKey}.png`;
  a.click();
}
async function shareNative(target){
  const canvas=document.getElementById('shareCanvas');
  if(!canvas) return;
  const txt=shareMode==='solo'
    ?`🍦 Mi perfil de nieve es: ${F[rKey]?.name}\n${F[rKey]?.persona}\n"${F[rKey]?.ins.hl}"\n\nDescubre el tuyo 👉 #NivPop`
    :`💞 Nuestro sabor compartido: ${F[dRKey]?.name}\n${DUO_ALL[dRKey]||''}\nCompatibilidad: ${lastCompat}%\n\n${dN1} & ${dN2}\n#NivPop #SaborCompartido`;
  if(navigator.share && navigator.canShare){
    try{
      canvas.toBlob(async blob=>{
        const file=new File([blob],`nivpop-${shareMode}.png`,{type:'image/png'});
        if(navigator.canShare({files:[file]})){
          await navigator.share({files:[file],text:txt,title:"NIV'Pop"});
        } else {
          await navigator.share({text:txt,title:"NIV'Pop"});
        }
      },'image/png');
    }catch(e){copyShareText(shareMode);}
  } else {
    downloadShare();
    await navigator.clipboard.writeText(txt).catch(()=>{});
    alert('Imagen descargada. Copia el texto y compártelo junto con la imagen. ✓');
  }
}
function copyShareText(mode){
  const f=mode==='solo'?F[rKey]:F[dRKey];
  let txt;
  if(mode==='solo'){
    txt=`🍦 Mi perfil de nieve es:\n\n${FLAVOR_EMOJI[rKey]||'🍦'} ${f.name}\n${f.persona}\n\n"${f.ins.hl}"\n\n¿Cuál eres tú? 👉 #NivPop`;
  } else {
    const k1=Object.entries(dScores1).sort((a,b)=>b[1]-a[1])[0][0];
    const k2=Object.entries(dScores2).sort((a,b)=>b[1]-a[1])[0][0];
    txt=`💞 Nuestra compatibilidad de nieve:\n\n${dN1}: ${FLAVOR_EMOJI[k1]||'🍦'} ${F[k1]?.name||''}\n${dN2}: ${FLAVOR_EMOJI[k2]||'🍦'} ${F[k2]?.name||''}\n\nNuestro sabor compartido: ${f.name}\n${DUO_ALL[dRKey]||''}\nCompatibilidad: ${lastCompat}%\n\n#NivPop #SaborCompartido`;
  }
  const btnId=mode==='solo'?'ssCopyBtn':'sdCopyBtn';
  navigator.clipboard.writeText(txt).then(()=>{
    const btn=document.getElementById(btnId);
    if(!btn) return;
    btn.textContent='✓ Copiado';
    btn.classList.add('done');
    setTimeout(()=>{btn.textContent='📋 Copiar texto';btn.classList.remove('done');},2200);
  }).catch(()=>alert('Copia este texto:\n\n'+txt));
}

// ════════ INIT ════════
buildCatalog();
document.getElementById('nameP')?.addEventListener('keydown',e=>{if(e.key==='Enter')startSolo('p');});
document.getElementById('nameT')?.addEventListener('keydown',e=>{if(e.key==='Enter')startSolo('t');});
document.getElementById('dN2')?.addEventListener('keydown',e=>{if(e.key==='Enter')startDuo();});

// ════════ IMPRIMIR + REGRESAR AL INICIO ════════
function printAndReturn() {
  // Imprimir
  window.print();

  // Mostrar countdown y regresar al welcome en 10 segundos
  const ticketVisible = document.getElementById('ks-ticket')?.classList.contains('active') ||
                        document.getElementById('ks-duo-ticket')?.classList.contains('active');

  // Crear overlay de countdown
  let overlay = document.getElementById('printCountdown');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'printCountdown';
    overlay.style.cssText = `
      position:fixed;bottom:24px;left:50%;transform:translateX(-50%);
      background:rgba(22,18,13,.92);backdrop-filter:blur(8px);
      color:#fff;padding:14px 28px;border-radius:30px;
      font-family:'Outfit',sans-serif;font-size:14px;font-weight:500;
      z-index:9999;display:flex;align-items:center;gap:12px;
      box-shadow:0 8px 32px rgba(0,0,0,.3);
    `;
    document.body.appendChild(overlay);
  }

  let secs = 10;
  overlay.innerHTML = `<span>🖨 Imprimiendo...</span><span id="cdNum" style="background:var(--rose,#c4786a);border-radius:50%;width:26px;height:26px;display:flex;align-items:center;justify-content:center;font-weight:700">${secs}</span><span style="color:rgba(255,255,255,.5)">Regresando al inicio</span>`;
  overlay.style.display = 'flex';

  const timer = setInterval(() => {
    secs--;
    const numEl = document.getElementById('cdNum');
    if (numEl) numEl.textContent = secs;
    if (secs <= 0) {
      clearInterval(timer);
      overlay.style.display = 'none';
      kGo('welcome');
      // Reset de estado
      cName=''; scores={}; curQ=0; hist=[]; rKey=''; testMode='p';
      dN1=''; dN2=''; dVin=''; dScores={}; dScores1={}; dScores2={}; dCurQ=0; dHist=[]; dRKey='';
    }
  }, 1000);

  // Si el usuario cancela la impresión, igual regresa
  setTimeout(() => { if(secs > 0) { clearInterval(timer); } }, 12000);
}


// ════════ VALIDACIÓN DE NOMBRE ════════
const PALABRAS_PROHIBIDAS = [
  'puta','puto','chinga','chingada','verga','pendejo','pendeja','culero','culera',
  'mierda','cabron','cabrona','pinche','mamada','mamadas','cagar','joder','coño',
  'culo','polla','gilipollas','hostia','wey','bitch','fuck','shit','ass','damn',
  'estupido','idiota','imbecil','tonto','bastardo','perra'
];
function validateName(name){
  if(!name || name.trim().length < 2) return {ok:false, msg:'El nombre debe tener al menos 2 caracteres.'};
  if(name.trim().length > 30) return {ok:false, msg:'El nombre es demasiado largo (máx. 30 caracteres).'};
  if(!/^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s'-]+$/i.test(name.normalize('NFD').replace(/[̀-ͯ]/g,''))) 
    return {ok:false, msg:'Solo se permiten letras y espacios.'};
  const lower = name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
  for(const w of PALABRAS_PROHIBIDAS){
    if(lower.includes(w)) return {ok:false, msg:'Por favor usa un nombre apropiado. 😊'};
  }
  return {ok:true};
}

function showNameError(inputId, msg){
  const el = document.getElementById(inputId);
  if(!el) return;
  el.style.borderColor = '#c4786a';
  el.style.animation = 'shake .3s ease';
  setTimeout(()=>{ el.style.animation=''; el.style.borderColor=''; },800);
  const err = document.createElement('div');
  err.style.cssText='color:#c4786a;font-size:11px;margin-top:4px;font-family:var(--fs)';
  err.textContent = msg;
  err.id = inputId+'_err';
  const old = document.getElementById(inputId+'_err');
  if(old) old.remove();
  el.parentNode.insertBefore(err, el.nextSibling);
  setTimeout(()=>{ const e=document.getElementById(inputId+'_err'); if(e)e.remove(); },3000);
}


// ════════ PAUSA DEL KIOSCO ════════
let _kioscoInterval = null;
function aplicarPausaKiosco(){
  const k = typeof NivDB !== 'undefined' ? NivDB.getKiosko() : {pausado:false};
  let overlay = document.getElementById('pauseOverlay');
  if(k.pausado){
    if(!overlay){
      overlay = document.createElement('div');
      overlay.id = 'pauseOverlay';
      overlay.style.cssText = 'position:fixed;inset:0;background:#16120d;z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px';
      overlay.innerHTML = `
        <div style="font-size:64px">⏸</div>
        <div style="font-family:var(--fd);font-size:28px;color:#fff;font-weight:700">Kiosco pausado</div>
        <div style="font-size:14px;color:rgba(255,255,255,.4)">El administrador ha pausado el sistema temporalmente</div>
        <div style="margin-top:20px;padding:12px 28px;border:1px solid rgba(255,255,255,.15);border-radius:8px;color:rgba(255,255,255,.3);font-size:12px">NIV'Pop</div>
      `;
      document.body.appendChild(overlay);
    }
    overlay.style.display = 'flex';
  } else {
    if(overlay) overlay.style.display = 'none';
  }
}

// Revisar estado de pausa cada 3 segundos
setInterval(aplicarPausaKiosco, 3000);
// Escuchar cambios inmediatos
window.addEventListener('storage', (e)=>{
  if(e.key === 'nivpop_kiosko') aplicarPausaKiosco();
});


// ════════ BRILLO DE PANTALLA ════════
function aplicarBrillo(){
  const k = typeof NivDB !== 'undefined' ? NivDB.getKiosko() : {brillo:80};
  const pct = (k.brillo || 80) / 100;
  // Aplicar brightness como CSS filter en el body
  document.body.style.filter = pct < 1 ? `brightness(${pct})` : '';
}
// Escuchar cambios de brillo desde el dashboard
window.addEventListener('storage', (e)=>{
  if(e.key === 'nivpop_kiosko') aplicarBrillo();
});
aplicarBrillo();


// ════════ ACTUALIZAR CONTADORES DE WELCOME ════════
function updateWelcomeCounters(){
  const flavors = typeof NivDB !== 'undefined' ? NivDB.getFlavors().filter(f=>f.activo) : Object.values(F);
  const countEl = document.querySelector('[data-counter="sabores"]');
  if(countEl) countEl.textContent = flavors.length;
  // También actualizar el número "16" hardcoded en el hero
  document.querySelectorAll('.w-stat-num, .kw-num').forEach(el=>{
    if(el.textContent.trim()==='16' || el.dataset.stat==='sabores'){
      el.textContent = flavors.length;
    }
  });
}
// Escuchar actualizaciones
window.addEventListener('storage', (e)=>{
  if(e.key === 'nivpop_flavors') updateWelcomeCounters();
});
document.addEventListener('DOMContentLoaded', updateWelcomeCounters);

// ════════ PIN ADMIN ════════
let _pin = '';
const ADMIN_PIN = '1234'; // PIN por defecto — cambiar desde configuración

function openPinModal(){
  _pin = '';
  updatePinDots();
  document.getElementById('pinError').textContent = '';
  const m = document.getElementById('adminPinModal');
  if(m){ m.style.display='flex'; }
}
function closePinModal(){
  const m = document.getElementById('adminPinModal');
  if(m){ m.style.display='none'; }
  _pin = '';
}
function pinInput(val){
  if(val === '⌫' || val === '') {
    if(val === '⌫') _pin = _pin.slice(0,-1);
    updatePinDots(); return;
  }
  if(_pin.length >= 4) return;
  _pin += val;
  updatePinDots();
  if(_pin.length === 4) setTimeout(checkPin, 200);
}
function updatePinDots(){
  for(let i=0;i<4;i++){
    const dot = document.getElementById('pd'+i);
    if(dot) dot.style.background = i < _pin.length ? '#c4786a' : '#e0e0e0';
  }
}
function checkPin(){
  const saved = typeof NivDB !== 'undefined' ? (NivDB.getConfig().adminPin || ADMIN_PIN) : ADMIN_PIN;
  if(_pin === saved){
    closePinModal();
    window.open('pages/dashboard.html','_blank');
  } else {
    document.getElementById('pinError').textContent = 'PIN incorrecto. Intenta de nuevo.';
    _pin = '';
    updatePinDots();
    // Shake animation
    const modal = document.querySelector('#adminPinModal > div');
    if(modal){ modal.style.animation='shake .4s ease'; setTimeout(()=>modal.style.animation='',500); }
  }
}

// ════════ SHAKE CSS ════════
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `@keyframes shake{0%,100%{transform:none}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}`;
document.head.appendChild(shakeStyle);

// ════════ AUTO-REGRESO AL INICIO (modo web) ════════
// Si el usuario está en la pantalla welcome del kiosco por más de 45s sin interacción
// solo aplica si NO está en modo kiosco activo
let _idleTimer = null;
let _idleSeconds = 0;
const IDLE_LIMIT = 45;

function resetIdleTimer(){
  _idleSeconds = 0;
  if(_idleTimer) clearInterval(_idleTimer);
  // Solo activar en pantalla welcome
  const welcomeActive = document.getElementById('ks-welcome')?.classList.contains('active') ||
    !document.querySelector('.ks.active');
  if(!welcomeActive) return;
  _idleTimer = setInterval(()=>{
    _idleSeconds++;
    if(_idleSeconds >= IDLE_LIMIT){
      clearInterval(_idleTimer);
      kGo('welcome');
    }
  }, 1000);
}

['click','keydown','touchstart','mousemove'].forEach(evt=>{
  document.addEventListener(evt, resetIdleTimer, {passive:true});
});
