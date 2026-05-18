MODULES = [{'id': 'intro',
  'title': '1. Εισαγωγή στη JavaScript',
  'level': 'Αρχάριος',
  'goal': 'Να κατανοήσεις τον ρόλο της JavaScript στο web και πώς συνεργάζεται με HTML και CSS.',
  'estimated_minutes': 25,
  'outcomes': ['Ξεχωρίζεις τον ρόλο HTML, CSS και JavaScript.',
               'Χρησιμοποιείς την κονσόλα για απλό έλεγχο κώδικα.',
               'Αναγνωρίζεις παραδείγματα διαδραστικότητας σε πραγματικές ιστοσελίδες.'],
  'key_terms': ['HTML', 'CSS', 'JavaScript', 'browser', 'console', 'event'],
  'content': [{'heading': 'Τι είναι η JavaScript',
               'body': 'Η JavaScript είναι γλώσσα προγραμματισμού που εκτελείται κυρίως στον browser και επιτρέπει σε '
                       'μία ιστοσελίδα να αντιδρά στις ενέργειες του χρήστη. Χρησιμοποιείται για κουμπιά, φόρμες, '
                       'δυναμικό περιεχόμενο, web εφαρμογές, παιχνίδια, dashboards και επικοινωνία με APIs.',
               'code': "console.log('Γεια σου JavaScript!');"},
              {'heading': 'HTML, CSS και JavaScript',
               'body': 'Η HTML περιγράφει τη δομή, η CSS την εμφάνιση και η JavaScript τη συμπεριφορά. Σε μία '
                       'εκπαιδευτική εφαρμογή, η HTML μπορεί να περιέχει τις ερωτήσεις, η CSS να τις μορφοποιεί και η '
                       'JavaScript να ελέγχει τις απαντήσεις.',
               'code': "const button = document.querySelector('button');\n"
                       "button.addEventListener('click', () => {\n"
                       "  alert('Πάτησες το κουμπί');\n"
                       '});'},
              {'heading': 'Η κονσόλα ως εργαλείο μάθησης',
               'body': 'Η κονσόλα του browser είναι χώρος πειραματισμού. Μπορείς να εκτελείς εντολές, να βλέπεις τιμές '
                       'μεταβλητών και να εντοπίζεις λάθη. Είναι από τα πρώτα εργαλεία που χρησιμοποιεί ένας '
                       'προγραμματιστής.',
               'code': "const message = 'Μαθαίνω βήμα βήμα';\nconsole.log(message);"},
              {'heading': 'Πώς σκέφτεται ένα πρόγραμμα',
               'body': 'Ένα πρόγραμμα είναι σειρά οδηγιών. Ο προγραμματιστής περιγράφει ποια δεδομένα χρειάζονται, '
                       'ποια βήματα εκτελούνται και τι αποτέλεσμα πρέπει να εμφανιστεί στον χρήστη.',
               'code': "const userName = 'Νίκος';\nconsole.log('Καλώς ήρθες, ' + userName);"}],
  'practice_tasks': ['Άνοιξε την κονσόλα του browser και εκτέλεσε δύο console.log μηνύματα.',
                     'Βρες σε μία ιστοσελίδα τρία σημεία όπου πιθανότατα χρησιμοποιείται JavaScript.',
                     'Περιέγραψε με δικά σου λόγια τι κάνει η JavaScript σε μία φόρμα εγγραφής.'],
  'mini_project': {'title': 'Μικρό project: διαδραστικό κουμπί',
                   'description': 'Σχεδίασε ένα κουμπί που όταν πατηθεί εμφανίζει μήνυμα καλωσορίσματος. Στόχος είναι '
                                  'να συνδέσεις HTML στοιχείο με JavaScript event.',
                   'steps': ['Δημιούργησε ένα button στην HTML.',
                             'Βρες το με querySelector.',
                             'Πρόσθεσε click event.',
                             'Εμφάνισε μήνυμα με alert ή textContent.']},
  'activities': [{'title': 'Δραστηριότητα κατανόησης',
                  'task': 'Κατάγραψε ποια από τα παρακάτω είναι ρόλος της HTML, της CSS ή της JavaScript: τίτλος '
                          'σελίδας, χρώμα κουμπιού, μήνυμα όταν πατηθεί το κουμπί.',
                  'solution': 'HTML: τίτλος σελίδας. CSS: χρώμα κουμπιού. JavaScript: μήνυμα μετά από click.',
                  'checks': ['HTML', 'CSS', 'JavaScript']},
                 {'title': 'Μικρή άσκηση κώδικα',
                  'task': "Συμπλήρωσε μία εντολή που εμφανίζει στην κονσόλα το μήνυμα 'Μαθαίνω JavaScript'.",
                  'solution': "console.log('Μαθαίνω JavaScript');",
                  'checks': ['console.log', 'Μαθαίνω JavaScript']},
                 {'title': 'Σενάριο πραγματικής χρήσης',
                  'task': "Περιέγραψε τι θα πρέπει να κάνει η JavaScript όταν ο χρήστης πατά κουμπί 'Έλεγχος "
                          "απάντησης' σε quiz.",
                  'solution': 'Πρέπει να διαβάσει την επιλεγμένη απάντηση, να τη συγκρίνει με τη σωστή, να εμφανίσει '
                              'feedback και να αποθηκεύσει την προσπάθεια.',
                  'checks': ['απάντηση', 'σωστή', 'feedback']}],
  'remedial': "Ξαναδιάβασε τη διαφορά HTML, CSS και JavaScript και εστίασε στο ποια τεχνολογία απαντά στο 'δομή', "
              "'εμφάνιση', 'συμπεριφορά'.",
  'challenge': 'Βρες τρία παραδείγματα διαδραστικότητας σε μία ιστοσελίδα και εξήγησε ποιο event πιθανότατα '
               'χρησιμοποιείται.'},
 {'id': 'basics',
  'title': '2. Μεταβλητές, τύποι και συνθήκες',
  'level': 'Βασικό',
  'goal': 'Να αποθηκεύεις δεδομένα, να αναγνωρίζεις τύπους τιμών και να γράφεις απλές αποφάσεις.',
  'estimated_minutes': 35,
  'outcomes': ['Χρησιμοποιείς let και const με σωστό τρόπο.',
               'Αναγνωρίζεις string, number, boolean, array και object.',
               'Γράφεις if/else για απλές αποφάσεις.'],
  'key_terms': ['let', 'const', 'string', 'number', 'boolean', 'if', 'else'],
  'content': [{'heading': 'Μεταβλητές',
               'body': 'Οι μεταβλητές αποθηκεύουν πληροφορίες που χρησιμοποιεί το πρόγραμμα. Το const χρησιμοποιείται '
                       'όταν δεν θέλουμε νέα ανάθεση τιμής, ενώ το let όταν η τιμή μπορεί να αλλάξει.',
               'code': "const studentName = 'Μαρία';\nlet score = 8;\nscore = 9;"},
              {'heading': 'Τύποι δεδομένων',
               'body': 'Κάθε τιμή έχει τύπο. Ένα όνομα είναι string, ένας βαθμός είναι number, μία απάντηση '
                       'σωστό/λάθος είναι boolean. Η κατανόηση τύπων βοηθά στην αποφυγή λαθών.',
               'code': "const title = 'Quiz';\nconst attempts = 3;\nconst passed = true;"},
              {'heading': 'Συνθήκες',
               'body': 'Οι συνθήκες επιτρέπουν στο πρόγραμμα να εκτελεί διαφορετικό κώδικα ανάλογα με την κατάσταση. '
                       'Σε εκπαιδευτικό λογισμικό, αυτό είναι χρήσιμο για feedback και adaptive learning.',
               'code': 'if (score >= 60) {\n'
                       "  console.log('Συνέχισε στην επόμενη ενότητα');\n"
                       '} else {\n'
                       "  console.log('Κάνε επανάληψη');\n"
                       '}'},
              {'heading': 'Συνηθισμένα λάθη',
               'body': 'Συχνά λάθη αρχαρίων είναι η χρήση μεταβλητής πριν δηλωθεί, η σύγχυση ανάμεσα σε = και ===, και '
                       'η σύγκριση διαφορετικών τύπων χωρίς προσοχή.',
               'code': "const age = '18';\nconsole.log(age === 18); // false, γιατί string !== number"}],
  'practice_tasks': ['Δήλωσε τρεις μεταβλητές για όνομα, βαθμό και αν ο μαθητής πέρασε.',
                     'Γράψε if/else που εμφανίζει διαφορετικό μήνυμα για score πάνω ή κάτω από 60.',
                     'Δοκίμασε στην κονσόλα τη διαφορά ανάμεσα σε == και ===.'],
  'mini_project': {'title': 'Μικρό project: υπολογισμός επιτυχίας',
                   'description': 'Φτιάξε λογική που δέχεται βαθμό quiz και εμφανίζει αν ο χρήστης συνεχίζει ή '
                                  'χρειάζεται επανάληψη.',
                   'steps': ['Δήλωσε μεταβλητή score.',
                             'Γράψε if/else.',
                             'Εμφάνισε μήνυμα.',
                             'Άλλαξε τιμές για να ελέγξεις όλα τα σενάρια.']},
  'activities': [{'title': 'Πρόβλεψη αποτελέσματος',
                  'task': 'Τι θα εμφανιστεί αν score = 45 και ο κώδικας ελέγχει if (score >= 60);',
                  'solution': 'Θα εκτελεστεί το else, γιατί το 45 είναι μικρότερο από το 60.',
                  'checks': ['else', '45', '60']},
                 {'title': 'Μικρή άσκηση κώδικα',
                  'task': "Γράψε if/else που εμφανίζει 'Πέρασες' όταν grade >= 5 και 'Προσπάθησε ξανά' διαφορετικά.",
                  'solution': 'if (grade >= 5) {\n'
                              "  console.log('Πέρασες');\n"
                              '} else {\n'
                              "  console.log('Προσπάθησε ξανά');\n"
                              '}',
                  'checks': ['if', 'grade', 'else']},
                 {'title': 'Εντοπισμός λάθους',
                  'task': "Εξήγησε γιατί η σύγκριση '5' === 5 επιστρέφει false.",
                  'solution': 'Επιστρέφει false επειδή η πρώτη τιμή είναι string και η δεύτερη number. Το === ελέγχει '
                              'και τιμή και τύπο.',
                  'checks': ['string', 'number', 'τύπο']}],
  'remedial': 'Κάνε επανάληψη στους τύπους δεδομένων και γράψε μικρά παραδείγματα με boolean συγκρίσεις.',
  'challenge': 'Φτιάξε σύστημα μηνυμάτων με τρία επίπεδα: κάτω από 50, 50-84, 85 και πάνω.'},
 {'id': 'functions',
  'title': '3. Συναρτήσεις και οργάνωση κώδικα',
  'level': 'Βασικό προς μεσαίο',
  'goal': 'Να οργανώνεις επαναχρησιμοποιήσιμη λογική με συναρτήσεις και παραμέτρους.',
  'estimated_minutes': 40,
  'outcomes': ['Γράφεις συναρτήσεις με παραμέτρους.',
               'Χρησιμοποιείς return για επιστροφή αποτελέσματος.',
               'Διαχωρίζεις υπολογισμό από εμφάνιση.'],
  'key_terms': ['function', 'parameter', 'argument', 'return', 'scope', 'arrow function'],
  'content': [{'heading': 'Γιατί χρειαζόμαστε συναρτήσεις',
               'body': 'Οι συναρτήσεις ομαδοποιούν εντολές με όνομα. Αν μία ενέργεια επαναλαμβάνεται, τη βάζουμε σε '
                       'συνάρτηση ώστε ο κώδικας να είναι καθαρότερος και πιο εύκολος στη συντήρηση.',
               'code': "function sayHello(name) {\n  return 'Γεια σου, ' + name;\n}"},
              {'heading': 'Παράμετροι και arguments',
               'body': 'Η παράμετρος είναι το όνομα που χρησιμοποιεί η συνάρτηση εσωτερικά. Το argument είναι η '
                       'πραγματική τιμή που δίνουμε όταν καλούμε τη συνάρτηση.',
               'code': 'function doubleNumber(number) {\n  return number * 2;\n}\nconsole.log(doubleNumber(6));'},
              {'heading': 'Return αντί για console.log',
               'body': 'Το console.log εμφανίζει κάτι στην κονσόλα. Το return επιστρέφει αποτέλεσμα ώστε να μπορεί να '
                       'χρησιμοποιηθεί αλλού στο πρόγραμμα.',
               'code': 'function calculatePercentage(score, total) {\n  return Math.round((score / total) * 100);\n}'},
              {'heading': 'Arrow functions',
               'body': 'Οι arrow functions είναι πιο σύντομος τρόπος γραφής συναρτήσεων και χρησιμοποιούνται συχνά σε '
                       'callbacks, events και array methods.',
               'code': 'const isPassing = (score) => score >= 60;'}],
  'practice_tasks': ['Γράψε συνάρτηση που δέχεται δύο αριθμούς και επιστρέφει το άθροισμα.',
                     'Γράψε συνάρτηση που δέχεται score και επιστρέφει μήνυμα ανατροφοδότησης.',
                     'Μετέτρεψε μία απλή function σε arrow function.'],
  'mini_project': {'title': 'Μικρό project: μηχανισμός feedback',
                   'description': 'Φτιάξε συνάρτηση που δέχεται ποσοστό επιτυχίας και επιστρέφει εξατομικευμένο '
                                  'μήνυμα.',
                   'steps': ['Δημιούργησε function getFeedback(percent).',
                             'Έλεγξε τρία επίπεδα επίδοσης.',
                             'Επέστρεψε διαφορετικό μήνυμα.',
                             'Δοκίμασε με 40, 70 και 95.']},
  'activities': [{'title': 'Συμπλήρωση συνάρτησης',
                  'task': 'Γράψε συνάρτηση add που δέχεται a και b και επιστρέφει το άθροισμά τους.',
                  'solution': 'function add(a, b) {\n  return a + b;\n}',
                  'checks': ['function', 'add', 'return']},
                 {'title': 'Εξήγηση έννοιας',
                  'task': 'Εξήγησε με παράδειγμα τη διαφορά parameter και argument.',
                  'solution': "Στο function hello(name), το name είναι parameter. Στο hello('Άννα'), το 'Άννα' είναι "
                              'argument.',
                  'checks': ['parameter', 'argument']},
                 {'title': 'Μετατροπή σε arrow function',
                  'task': 'Μετέτρεψε τη function isAdult(age) { return age >= 18; } σε arrow function.',
                  'solution': 'const isAdult = (age) => age >= 18;',
                  'checks': ['const', '=>', 'age']}],
  'remedial': 'Ξαναδούλεψε τη διαφορά console.log και return με μικρές συναρτήσεις.',
  'challenge': 'Φτιάξε μία συνάρτηση που δέχεται πίνακα βαθμών και επιστρέφει μέσο όρο, μέγιστο και ελάχιστο.'},
 {'id': 'arrays',
  'title': '4. Πίνακες, loops και επανάληψη',
  'level': 'Μεσαίο',
  'goal': 'Να διαχειρίζεσαι συλλογές δεδομένων και να επαναλαμβάνεις ενέργειες με loops και array methods.',
  'estimated_minutes': 45,
  'outcomes': ['Χρησιμοποιείς arrays για λίστες τιμών.',
               'Γράφεις for loop για επανάληψη.',
               'Χρησιμοποιείς map, filter και reduce σε απλά παραδείγματα.'],
  'key_terms': ['array', 'index', 'for', 'forEach', 'map', 'filter', 'reduce'],
  'content': [{'heading': 'Τι είναι ένας πίνακας',
               'body': 'Ένας πίνακας αποθηκεύει πολλές τιμές σε μία μεταβλητή. Είναι ιδανικός για λίστες ερωτήσεων, '
                       'βαθμών, μαθημάτων ή απαντήσεων.',
               'code': 'const scores = [80, 65, 92, 48];\nconsole.log(scores[0]);'},
              {'heading': 'Επανάληψη με for',
               'body': 'Τα loops επιτρέπουν να εκτελέσουμε την ίδια λογική για κάθε στοιχείο. Σε quiz μπορούμε να '
                       'περάσουμε όλες τις απαντήσεις και να μετρήσουμε τις σωστές.',
               'code': 'let total = 0;\nfor (let i = 0; i < scores.length; i++) {\n  total += scores[i];\n}'},
              {'heading': 'forEach, map και filter',
               'body': 'Τα array methods κάνουν τον κώδικα πιο εκφραστικό. Το forEach εκτελεί ενέργεια, το map '
                       'δημιουργεί νέο πίνακα, το filter κρατά στοιχεία που περνούν ένα κριτήριο.',
               'code': 'const passedScores = scores.filter((score) => score >= 60);\n'
                       "const labels = scores.map((score) => score + '%');"},
              {'heading': 'Reduce για σύνολα',
               'body': 'Το reduce μετατρέπει έναν πίνακα σε μία τιμή, όπως άθροισμα ή μέσο όρο. Είναι χρήσιμο για '
                       'αναφορές προόδου.',
               'code': 'const sum = scores.reduce((total, score) => total + score, 0);\n'
                       'const average = sum / scores.length;'}],
  'practice_tasks': ['Φτιάξε πίνακα με πέντε βαθμούς quiz.',
                     'Υπολόγισε πόσοι βαθμοί είναι πάνω από 60.',
                     'Μετέτρεψε τους βαθμούς σε labels με σύμβολο %.'],
  'mini_project': {'title': 'Μικρό project: αναφορά βαθμολογιών',
                   'description': 'Δημιούργησε μικρό πρόγραμμα που υπολογίζει μέσο όρο, πλήθος επιτυχιών και καλύτερη '
                                  'επίδοση από πίνακα βαθμών.',
                   'steps': ['Δήλωσε array scores.',
                             'Υπολόγισε average με reduce.',
                             'Βρες passed με filter.',
                             'Εμφάνισε σύνοψη στην κονσόλα.']},
  'activities': [{'title': 'Πίνακας βαθμών',
                  'task': 'Γράψε πίνακα scores με τις τιμές 70, 85, 40 και 95.',
                  'solution': 'const scores = [70, 85, 40, 95];',
                  'checks': ['scores', '70', '95']},
                 {'title': 'Filter',
                  'task': 'Γράψε έκφραση που κρατά μόνο βαθμούς >= 60 από τον πίνακα scores.',
                  'solution': 'const passed = scores.filter((score) => score >= 60);',
                  'checks': ['filter', 'score', '60']},
                 {'title': 'Reduce',
                  'task': 'Εξήγησε γιατί το reduce είναι χρήσιμο για υπολογισμό μέσου όρου.',
                  'solution': 'Το reduce μπορεί να αθροίσει όλες τις τιμές του πίνακα. Μετά διαιρούμε το άθροισμα με '
                              'το πλήθος στοιχείων.',
                  'checks': ['άθροισμα', 'πίνακα', 'πλήθος']}],
  'remedial': 'Εξασκήσου πρώτα σε απλά arrays και indexes πριν περάσεις στα map/filter/reduce.',
  'challenge': 'Φτιάξε function summarizeScores(scores) που επιστρέφει object με average, passedCount και bestScore.'},
 {'id': 'objects',
  'title': '5. Objects, JSON και μοντελοποίηση δεδομένων',
  'level': 'Μεσαίο',
  'goal': 'Να αναπαριστάς πραγματικά δεδομένα με objects και να κατανοείς τη μορφή JSON.',
  'estimated_minutes': 45,
  'outcomes': ['Δημιουργείς objects με properties.',
               'Διαβάζεις και αλλάζεις τιμές object.',
               'Κατανοείς γιατί τα APIs συχνά επιστρέφουν JSON.'],
  'key_terms': ['object', 'property', 'method', 'JSON', 'API', 'destructuring'],
  'content': [{'heading': 'Objects',
               'body': 'Τα objects αναπαριστούν οντότητες με ιδιότητες. Ένας μαθητής μπορεί να έχει όνομα, επίπεδο, '
                       'βαθμούς και ολοκληρωμένες ενότητες.',
               'code': "const student = {\n  name: 'Ελένη',\n  level: 'beginner',\n  score: 82\n};"},
              {'heading': 'Πρόσβαση σε properties',
               'body': 'Μπορούμε να διαβάζουμε ή να αλλάζουμε ιδιότητες με dot notation. Αυτό κάνει εύκολη τη '
                       'διαχείριση κατάστασης εφαρμογής.',
               'code': 'console.log(student.name);\nstudent.score = 90;'},
              {'heading': 'JSON',
               'body': 'Το JSON είναι μορφή ανταλλαγής δεδομένων που μοιάζει με JavaScript object. Χρησιμοποιείται σε '
                       'APIs, αποθήκευση ρυθμίσεων και επικοινωνία frontend-backend.',
               'code': 'const jsonText = JSON.stringify(student);\nconst parsed = JSON.parse(jsonText);'},
              {'heading': 'Destructuring',
               'body': 'Το destructuring επιτρέπει να παίρνουμε properties σε ξεχωριστές μεταβλητές με πιο σύντομο '
                       'τρόπο.',
               'code': 'const { name, score } = student;\nconsole.log(name, score);'}],
  'practice_tasks': ['Φτιάξε object για μία ερώτηση quiz με prompt, options και answer.',
                     'Μετέτρεψε object σε JSON string και πίσω σε object.',
                     'Χρησιμοποίησε destructuring για να πάρεις δύο properties.'],
  'mini_project': {'title': 'Μικρό project: μοντέλο ερώτησης quiz',
                   'description': 'Σχεδίασε object που περιγράφει μία ερώτηση quiz και γράψε function που ελέγχει αν η '
                                  'απάντηση είναι σωστή.',
                   'steps': ['Δημιούργησε object question.',
                             'Πρόσθεσε prompt/options/answer.',
                             'Γράψε checkAnswer(question, selected).',
                             'Επέστρεψε true ή false.']},
  'activities': [{'title': 'Object μαθητή',
                  'task': 'Γράψε object student με name, score και completedModules.',
                  'solution': "const student = {\n  name: 'Άννα',\n  score: 88,\n  completedModules: 3\n};",
                  'checks': ['student', 'name', 'score']},
                 {'title': 'JSON',
                  'task': 'Γράψε εντολή που μετατρέπει το student object σε JSON string.',
                  'solution': 'const json = JSON.stringify(student);',
                  'checks': ['JSON.stringify', 'student']},
                 {'title': 'Destructuring',
                  'task': 'Πάρε τα name και score από το student με destructuring.',
                  'solution': 'const { name, score } = student;',
                  'checks': ['name', 'score', 'student']}],
  'remedial': 'Ξαναδούλεψε απλά objects πριν προχωρήσεις σε JSON και destructuring.',
  'challenge': 'Φτιάξε πίνακα από question objects και υπολόγισε πόσες απαντήσεις είναι σωστές.'},
 {'id': 'dom_async',
  'title': '6. DOM, events και ασύγχρονη λογική',
  'level': 'Μεσαίο προς προχωρημένο',
  'goal': 'Να συνδέεις JavaScript με τη σελίδα, events και ασύγχρονες κλήσεις δεδομένων.',
  'estimated_minutes': 55,
  'outcomes': ['Επιλέγεις DOM στοιχεία με selectors.',
               'Χειρίζεσαι click, input και submit events.',
               'Χρησιμοποιείς fetch και async/await για δεδομένα.'],
  'key_terms': ['DOM', 'querySelector', 'addEventListener', 'event', 'fetch', 'async', 'await'],
  'content': [{'heading': 'DOM',
               'body': 'Το DOM είναι η αναπαράσταση της HTML ως αντικείμενα. Με JavaScript μπορούμε να αλλάξουμε '
                       'κείμενο, κλάσεις, attributes και να δημιουργήσουμε νέα στοιχεία.',
               'code': "const title = document.querySelector('#title');\ntitle.textContent = 'Νέος τίτλος';"},
              {'heading': 'Events',
               'body': 'Τα events επιτρέπουν στην εφαρμογή να αντιδρά σε ενέργειες του χρήστη. Σε εκπαιδευτικό '
                       'λογισμικό χρησιμοποιούνται για quiz, φόρμες, hints και δραστηριότητες.',
               'code': "const button = document.querySelector('#check');\n"
                       "button.addEventListener('click', () => {\n"
                       "  console.log('Έλεγχος απάντησης');\n"
                       '});'},
              {'heading': 'Forms',
               'body': 'Οι φόρμες επιτρέπουν εισαγωγή δεδομένων. Με submit event μπορούμε να ελέγξουμε απαντήσεις '
                       'χωρίς να φορτώσει ξανά η σελίδα.',
               'code': "form.addEventListener('submit', (event) => {\n"
                       '  event.preventDefault();\n'
                       "  console.log('Η φόρμα ελέγχθηκε');\n"
                       '});'},
              {'heading': 'Async/await και fetch',
               'body': 'Η επικοινωνία με server γίνεται ασύγχρονα. Το fetch επιστρέφει Promise, ενώ το await επιτρέπει '
                       'να περιμένουμε το αποτέλεσμα με καθαρό κώδικα.',
               'code': 'async function loadReport() {\n'
                       "  const response = await fetch('/api/report?user_id=1');\n"
                       '  return await response.json();\n'
                       '}'}],
  'practice_tasks': ['Άλλαξε το textContent ενός στοιχείου με id result.',
                     'Πρόσθεσε click event σε κουμπί.',
                     'Γράψε async function που διαβάζει JSON από endpoint.'],
  'mini_project': {'title': 'Μικρό project: quiz με DOM',
                   'description': 'Φτιάξε μικρό quiz μίας ερώτησης που διαβάζει επιλογή χρήστη και εμφανίζει '
                                  'σωστό/λάθος.',
                   'steps': ['Δημιούργησε radio inputs.',
                             'Πρόσθεσε submit event.',
                             'Διάβασε την επιλογή.',
                             'Εμφάνισε feedback στο DOM.']},
  'activities': [{'title': 'Αντιστοίχιση εννοιών',
                  'task': 'Αντιστοίχισε querySelector, addEventListener και fetch με επιλογή στοιχείου, χειρισμό '
                          'συμβάντος και φόρτωση δεδομένων.',
                  'solution': 'querySelector: επιλογή στοιχείου. addEventListener: χειρισμός συμβάντος. fetch: φόρτωση '
                              'δεδομένων.',
                  'checks': ['querySelector', 'addEventListener', 'fetch']},
                 {'title': 'Μικρή άσκηση DOM',
                  'task': "Γράψε κώδικα που αλλάζει το κείμενο ενός στοιχείου με id result σε 'Ολοκληρώθηκε'.",
                  'solution': "document.querySelector('#result').textContent = 'Ολοκληρώθηκε';",
                  'checks': ['querySelector', '#result', 'textContent']},
                 {'title': 'Async εξήγηση',
                  'task': 'Εξήγησε γιατί το fetch χρειάζεται await σε πολλές περιπτώσεις.',
                  'solution': 'Το fetch είναι ασύγχρονο και επιστρέφει Promise. Με await περιμένουμε να ολοκληρωθεί η '
                              'απάντηση πριν χρησιμοποιήσουμε τα δεδομένα.',
                  'checks': ['Promise', 'await', 'δεδομένα']}],
  'remedial': 'Πειραματίσου με querySelector, textContent και addEventListener πριν περάσεις στο fetch.',
  'challenge': 'Σχεδίασε φόρμα που φορτώνει δεδομένα από API και εμφανίζει μήνυμα λάθους όταν αποτύχει.'},
 {'id': 'debug_project',
  'title': '7. Debugging και τελικό mini project',
  'level': 'Προχωρημένο αρχαρίων',
  'goal': 'Να εντοπίζεις λάθη, να οργανώνεις λύση και να σχεδιάζεις μικρή web εφαρμογή.',
  'estimated_minutes': 60,
  'outcomes': ['Διαβάζεις μηνύματα σφάλματος στην κονσόλα.',
               'Χρησιμοποιείς console.log και breakpoints ως στρατηγική ελέγχου.',
               'Σχεδιάζεις μικρή εφαρμογή με δεδομένα, DOM και events.'],
  'key_terms': ['debugging', 'syntax error', 'runtime error', 'breakpoint', 'state', 'feature'],
  'content': [{'heading': 'Τύποι λαθών',
               'body': 'Τα syntax errors συμβαίνουν όταν ο κώδικας δεν είναι γραμματικά σωστός. Τα runtime errors '
                       'εμφανίζονται όταν ο κώδικας ξεκινά αλλά κάτι αποτυγχάνει κατά την εκτέλεση.',
               'code': "console.log('λείπει παρένθεση'; // SyntaxError"},
              {'heading': 'Debugging με console.log',
               'body': 'Το console.log βοηθά να δούμε τιμές σε συγκεκριμένα σημεία. Δεν λύνει το πρόβλημα μόνο του, '
                       'αλλά μας δείχνει πού αποκλίνει η πραγματική συμπεριφορά από την αναμενόμενη.',
               'code': "console.log('selectedAnswer:', selectedAnswer);\n"
                       "console.log('correctAnswer:', correctAnswer);"},
              {'heading': 'Κατάσταση εφαρμογής',
               'body': 'Το state είναι τα δεδομένα που περιγράφουν την τρέχουσα κατάσταση. Για παράδειγμα, ενεργή '
                       'ενότητα, χρήστης, σκορ και απαντήσεις. Καλή οργάνωση state κάνει την εφαρμογή πιο αξιόπιστη.',
               'code': "const state = {\n  activeModule: 'intro',\n  score: 0,\n  completed: []\n};"},
              {'heading': 'Τελικό project',
               'body': 'Στο τελικό project συνδυάζονται όλα: δεδομένα, συναρτήσεις, arrays, objects, DOM, events, '
                       'αποθήκευση προόδου και αναφορά. Αυτό είναι το σημείο όπου η γνώση γίνεται εφαρμογή.',
               'code': 'function updateProgress(moduleId, score) {\n'
                       '  return { moduleId, score, completedAt: Date.now() };\n'
                       '}'}],
  'practice_tasks': ['Διόρθωσε ένα syntax error σε μικρό snippet.',
                     'Χρησιμοποίησε console.log για να ελέγξεις τιμή μεταβλητής.',
                     'Περιέγραψε τα βασικά features ενός δικού σου quiz app.'],
  'mini_project': {'title': 'Τελικό project: προσωπικό quiz app',
                   'description': 'Σχεδίασε μικρή εφαρμογή quiz με τρεις ερωτήσεις, αποθήκευση σκορ και μήνυμα '
                                  'προσαρμοσμένης μάθησης.',
                   'steps': ['Ορισμός πίνακα questions.',
                             'Rendering ερωτήσεων στο DOM.',
                             'Υποβολή και υπολογισμός σκορ.',
                             'Feedback ανάλογα με επίδοση.',
                             'Αποθήκευση αποτελέσματος.']},
  'activities': [{'title': 'Εντοπισμός syntax error',
                  'task': "Εξήγησε ποιο είναι το λάθος στο console.log('test';",
                  'solution': 'Λείπει η δεξιά παρένθεση πριν το ελληνικό ερωτηματικό/semicolon.',
                  'checks': ['παρένθεση', 'λείπει']},
                 {'title': 'Στρατηγική debugging',
                  'task': 'Πού θα έβαζες console.log αν ένα quiz εμφανίζει πάντα λάθος αποτέλεσμα;',
                  'solution': 'Θα έβαζα console.log στην επιλεγμένη απάντηση, στη σωστή απάντηση και στον υπολογισμό '
                              'score.',
                  'checks': ['επιλεγμένη', 'σωστή', 'score']},
                 {'title': 'Σχεδίαση project',
                  'task': 'Γράψε τρία βασικά features που πρέπει να έχει ένα ολοκληρωμένο quiz app.',
                  'solution': 'Ερωτήσεις, υποβολή απαντήσεων, υπολογισμός σκορ, feedback και αποθήκευση προόδου.',
                  'checks': ['ερωτήσεις', 'score', 'feedback']}],
  'remedial': 'Ξεκίνα από μικρά snippets και χρησιμοποίησε console.log πριν προσπαθήσεις να διορθώσεις μεγάλο κομμάτι '
              'κώδικα.',
  'challenge': 'Φτιάξε αναλυτικό πλάνο για quiz app με δεδομένα, UI, αποθήκευση και adaptive feedback.'}]
