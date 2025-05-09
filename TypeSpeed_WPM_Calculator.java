import java.util.Scanner;
import java.util.concurrent.TimeUnit;
import java.time.LocalTime;
import java.util.Random;

// LinkedList class for managing characters
class LinkedList {
    // Node class representing each character
    class Node {
        char data;
        Node next;
        
        // Constructor for Node
        Node(char d) {
            data = d;
            next = null;
        }
    }
    
    Node head = null;
    Node tail = null;

    // Method to insert a character at the end of the linked list
    public void insertAtLast(char word) {
        Node newNode = new Node(word);
        
        // Check if the list is empty
        if (head == null) {
            head = newNode;
            tail = newNode;
        } else {
            tail.next = newNode;
            newNode.next = null;
            tail = newNode;
        }
    }
}

// Main class for typing speed and WPM calculation
class TypeSpeed_WPM_Calculator {
    public static void main(String[] args) throws InterruptedException {
        Scanner sc = new Scanner(System.in);
        System.out.print("\033[H\033[2J"); // to clear screen
        header();
        System.out.println("\n");
        showLoadingProgress();
        first_page();
        Menu();
        TimeUnit.SECONDS.sleep(1);
        System.out.print("\033[H\033[2J"); // to clear screen
        mainPage();
    }

    // Method for the main typing page
    public static void mainPage() {
        try {
            while (true) {
                header();
                System.out.println(yellow + "Countdown Starts Now: " + reset);
                TimeUnit.SECONDS.sleep(1);
                System.out.print("3--");
                TimeUnit.SECONDS.sleep(1);
                System.out.print("2--");
                TimeUnit.SECONDS.sleep(1);
                System.out.println("1--");
                TimeUnit.SECONDS.sleep(1);
                System.out.print(yellow + "Press Enter to Start.." + reset);
                Scanner sc = new Scanner(System.in);
                sc.nextLine();
                sc.nextLine();
                TimeUnit.SECONDS.sleep(1);
                System.out.println(yellow + " Start Typing... " + reset);
                System.out.println();
                Random rand = new Random();
                StringBuilder originalWords = new StringBuilder();
                LinkedList l1 = new LinkedList();
                
                // Generate a random string for typing practice
                for (int i = 0; i < level; i++) {
                    String word = words[rand.nextInt(words.length)];
                    originalWords.append(word).append(" ");
                }
                
                char[] originalChars = originalWords.toString().toCharArray();
                
                // Insert each character into the linked list
                for (char ch : originalChars) {
                    l1.insertAtLast(ch);
                }

                System.out.println(originalWords);
                
                double start = LocalTime.now().toNanoOfDay();
                System.out.println(yellow + " \n Type Now-->" + green);
                System.out.println();
                String typedWords = sc.nextLine().trim();   
                char[] typedChars = typedWords.toCharArray();
                LinkedList l2 = new LinkedList();
                
                // Insert each typed character into another linked list
                for (char character : typedChars) {
                    l2.insertAtLast(character);
                }
                
                double end = LocalTime.now().toNanoOfDay();
                double elapsedTime = end - start;
                double seconds = elapsedTime / 1e9;

                // Calculate the number of correct characters
                int correctChars = countCorrectCharacters(l1, l2);

                // Calculate accuracy, gross speed, and net speed
                float accuracy = ((float) correctChars / typedChars.length) * 100;
                String formattedAccuracy = String.format("%.2f%%", accuracy); //23.00%
                int typedChar = typedWords.length();
                int netSpeed = (int) ((((double) correctChars / 5) / seconds) * 60);
                int wpm = (int) ((((double) typedChar / 5) / seconds) * 60);

                System.out.println(blue + "\n-------------------------");
                System.out.println(yellow + " Gross Speed : " + reset + wpm + " wpm");
                System.out.println(yellow + " Accuracy    : " + reset + formattedAccuracy);
                System.out.println(yellow + " Net Speed   : " + reset + netSpeed + " wpm");
                System.out.println(blue + "-------------------------");
                
                System.out.println("\n\t\t\t-> Press '1' to restart\n\t\t\t-> Press '2' to exit \n\t\t\t-> press '0' to main menu");

                try {
                    int input = sc.nextInt();
                    System.out.print("\033[H\033[2J"); // to clear screen
                    
                    if (input == 0) {
                        System.out.print("\033[H\033[2J"); // to clear screen
                        Menu();
                    }
                    
                    // Exit the program if input is 2
                    if (input == 2) {
                        System.out.println("\n*************************************");
                        System.out.println("********** " + reset + "Program Ended " + blue + "************");
                        System.out.println("*************************************" + reset);
                        return;
                    }
                } catch (Exception e) {
                    System.out.print("\033[H\033[2J"); // to clear screen
                    System.out.println("invalid input @_@ ");
                    TimeUnit.SECONDS.sleep(2);
                    System.out.println(yellow + "\n( Default : Program is Restarting !) +");
                    TimeUnit.SECONDS.sleep(2);
                    System.out.print("\033[H\033[2J"); // to clear screen
                }
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    // Method to count correct characters between two linked lists
    private static int countCorrectCharacters(LinkedList originalList, LinkedList typedList) {
        LinkedList.Node originalNode = originalList.head;
        LinkedList.Node typedNode = typedList.head;
        int count = 0;

        while (typedNode != null && originalNode != null) {
            if (originalNode.data == typedNode.data) {
                count++;
            }

            originalNode = originalNode.next;
            typedNode = typedNode.next;
        }

        return count;
    }

    // Method to show loading progress
    private static void showLoadingProgress() {
        System.out.print("Starting...\nLoading <");
        for (int i = 0; i < 22; i++) {
            try {
                // Simulate some loading time
                Thread.sleep(300);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.print("*");
        }
        System.out.print(">");
        try {
            // Simulate some loading time
            Thread.sleep(500);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.print("\033[H\033[2J"); // to clear screen
        System.out.println(); // Move to the next line after loading is complete
        return;
    }

    // Method to display program header
    static void header() {
        System.out.println(blue + "*************************************");
        System.out.println("****** " + reset + "Typing Speed Calculator" + blue + " ******");
        System.out.println("*************************************\n");
    }

    // Method for displaying the first page of the program
    static void first_page() {
        System.out.print("\033[H\033[2J"); // to clear screen
        try {
            header();
            System.out.println(yellow + "\nThis Project is Developed and Presented by: ");
            System.out.print(blue + "\n====== " + reset + "GROUP #5" + blue + " ======\n" + green);
            System.out.print("\n1.FAWAD AHMAD BAIG ");
            System.out.print("\n2.SHAHBAZ AHMAD MAZARI ");
            System.out.print("\n3.MUHAMMAD ABDULLAH\n" + reset );
            TimeUnit.SECONDS.sleep(6);

            System.out.print("\033[H\033[2J"); // to clear screen
            header();
            System.out.println("");
            System.out.println(yellow + "\n Program is starting... \n" + reset);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    // Method to display the menu and handle user input for difficulty level
    public static void Menu() {
        Scanner sc = new Scanner(System.in);
        System.out.print("\033[H\033[2J"); // to clear screen
        header();
        System.out.println("\t(1). Easy");
        System.out.println("\t(2). Medium");
        System.out.println("\t(3). Hard");
        System.out.println("\t(4). Very Hard");
        System.out.print(green + "\nChoice : " + reset);

        try {
            int choice = sc.nextInt();

            do {
                switch (choice) {
                    case 1:
                        System.out.print("\033[H\033[2J"); // to clear screen
                        header();
                        System.out.println(yellow + "You selected Easy difficulty level." + reset);
                        TimeUnit.SECONDS.sleep(2);
                        System.out.print("\033[H\033[2J"); // to clear screen
                        // Add code for easy difficulty here
                        level = 1;
                        break;
                    case 2:
                        System.out.print("\033[H\033[2J"); // to clear screen
                        header();
                        System.out.println(yellow + "You selected Medium difficulty level." + reset);
                        TimeUnit.SECONDS.sleep(2);
                        System.out.print("\033[H\033[2J"); // to clear screen
                        // Add code for medium difficulty here
                        level = 2;
                        break;
                    case 3:
                        System.out.print("\033[H\033[2J"); // to clear screen
                        header();
                        System.out.println(yellow + "You selected Hard difficulty level." + reset);
                        TimeUnit.SECONDS.sleep(2);
                        System.out.print("\033[H\033[2J"); // to clear screen
                        // Add code for hard difficulty here
                        level = 3;
                        break;
                    case 4:
                        System.out.print("\033[H\033[2J"); // to clear screen
                        header();
                        System.out.println(yellow + "You selected Very Hard difficulty level." + reset);
                        TimeUnit.SECONDS.sleep(2);
                        System.out.print("\033[H\033[2J"); // to clear screen
                        // Add code for very hard difficulty here
                        level = 5;
                        break;
                    default:
                        System.out.print("\033[H\033[2J"); // to clear screen
                        System.out.println(red + "Invalid choice ! " + reset);
                        TimeUnit.SECONDS.sleep(2);
                        Menu();
                        System.out.print("\033[H\033[2J"); // to clear screen
                        break;
                }
            } while (choice != 1 && choice != 2 && choice != 3 && choice != 4 && choice <= 4);
        } catch (Exception e) {
            System.out.print("\033[H\033[2J"); // to clear screen
            System.out.println(red + "Invalid choice ! " + reset);
	    try{
		TimeUnit.SECONDS.sleep(2);
		}
		catch (InterruptedException f) {
            f.printStackTrace();
        }
            Menu();
        }
    }

    // Variable to store the difficulty level
    static int level;
    
    
    // Array of words for typing practice
    static String[] words = {
        "Artificial Intelligence (AI) refers to the development of machines with  the ability to perform tasks that typically require human intelligence.",
        "It involves creating systems that can learn, reason, and solve problems, often mimicking human cognitive functions.",
        "Narrow AI, a subset of AI, is designed for specific tasks, such as voice assistants, while General AI aspires to replicate human-like cognition across various domains.",
        "Key techniques in AI include Machine Learning, Deep Learning, Natural Language Processing, and Computer Vision.",
        "Machine Learning enables machines to learn from data and improve their performance over time.",
        "Deep Learning involves neural networks with multiple layers, allowing systems to automatically learn hierarchical representations of data.",
        "Natural Language Processing enables machines to understand, interpret, and generate human-like language.",
        "Computer Vision empowers machines to interpret and make decisions based on visual data.",
        "Ethical concerns in AI encompass issues like bias in algorithms, transparency in decision-making processes, job displacement, and data security.",
        "AI has the potential for transformative impact, requiring responsible development and ongoing research to address challenges and ensure its ethical deployment.",
        "The integration of AI technologies has led to the development of intelligent systems that can analyze vast amounts of data, providing valuable insights and predictions.",
           "In healthcare, AI is used for disease diagnosis and personalized treatment plans, improving the efficiency and accuracy of medical processes.",
           "AI-powered virtual assistants, like Siri and Alexa, demonstrate the practical application of Narrow AI in enhancing user experience and performing specific tasks.",
           "The field of robotics benefits from AI, enabling robots to navigate complex environments, perform tasks autonomously, and interact with humans more intuitively.",
           "AI algorithms are constantly evolving, adapting to new data and scenarios, making them versatile and capable of addressing a wide range of challenges.",
           "The responsible deployment of AI requires ongoing collaboration between technologists, ethicists, policymakers, and society at large to ensure its positive impact on humanity.",
           "As AI continues to advance, the exploration of quantum computing and other cutting-edge technologies holds promise for even more powerful and efficient AI systems.",
           "AI's role in addressing global challenges, such as climate change and healthcare disparities, highlights its potential as a force for positive societal change.",
           "The interdisciplinary nature of AI research involves contributions from computer science, neuroscience, psychology, and other fields, fostering a holistic understanding of intelligence."
        };
    // Color codes for console text formatting
    static String reset = "\u001B[0m";
    static String red = "\u001B[31m";
    static String green = "\u001B[32m";
    static String yellow = "\u001B[33m";
    static String blue = "\u001B[34m";
}