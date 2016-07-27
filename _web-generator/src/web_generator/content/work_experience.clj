(def work-experience
  [{:job-title "Co-founder"
    :company
      {:name "Kolobee - Interesting things nearby"
       :description
         (str "In this first stage our startup Kolobee developed a location based social network. People collaborated in interest groups to locate things they liked on a map. For example a group could spot and locate: all the cool graffitis, the best vegan restaurants or the best fishing spots.\n"
           "We developed a working product for the web and iPhone in which more than 1,000 users signed up but we failed to reach a critical mass of users for the product to add real value.")}
    :period
      {:start (time/date-time 2012 3 1)
       :end (time/date-time 2013 9 30)}
    :experience
      [{:title "CTO"
        :description
          (str "During this stage we were 4 in our team, we had a frontend developer and a graphic designer working with us. We successfully managed to ship a high quality product with very little resources and time. But, we did fail to build a simple product (MVP) as we jammed the product with all the cool features we could imagine.\n"
            "One of the best decisions we took was to split the platform into multiple services. One that took part of the core business logic providing web services to use it (API) and two other parts: the web client and the iOS app. Another key decision to keep costs down was to use only one programming language in almost all parts of the development which greatly reduced context switching improving our efficiency.\n")
        :tools ["Agile development" "SCRUM" "Pivotal Tracker"]}
       {:title "Backend developer"
        :description
          (str "We thought out an architecture that would last and would be useful in the long run, the result was an stateless server that could easily be scaled. Offered a REST API to the web a mobile app clients to authenticate, upload content, chat and query content nearby.")
        :tools ["JavaScript" "HTTP REST" "Node.js" "Restify" "MongoDB" "ImageMagick"]}
       {:title "Frontend developer"
        :description
          (str "Creating a dynamic web app that allowed users to upload images while interacting with a map to localize them proved to be a great learning experience.")
        :tools ["HTML" "JavaScript" "CSS" "LESS" "AJAX" "Node.js" "Express.js" "Backbone" "jQuery" "Google Maps"]}
       {:title "iOS developer"
        :description
          (str "We built an app that could do all the functionalities we did for our web. User took pictures with the app and then image was uploaded with the current user location. A map showed all the content around and users could chat.")
        :tools ["Objective-C" "Xcode" "Core Location" "Core Data" "MapKit"]}]}
   {:job-title "Software developer"
    :company
      {:name "BBVA - Corporate Investment Banking"
       :description "BBVA is a multinational Spanish banking group. I worked for the Corporate Investment Banking branch."}
    :period
      {:start (time/date-time 2009 10 1)
       :end (time/date-time 2012 2 29)}
    :experience
      {:description
        (str "Our team developed and maintained an in house derivatives pricing platform.\n"
          "Lot of effort was put to improve the quality of the software creating tests and refactoring code.\n"
          "I created a aspect-programming framework to parse and serialize xml to drastically reduce the code needed develop new data structures.\n"
          "Lead the development of a service to automate the deployment of the app to production.")
        :tools ["Java" "JUnit" "J2EE" "Oracle database" "Batch"]}}
   {:job-title "Software developer"
    :company
      {:name "Afi"
       :description "Afi is a leading Spanish provider of advisory, consultancy and training services in economics and finance."}
    :period
      {:start (time/date-time 2008 10 1)
       :end (time/date-time 2009 6 30)}
    :experience
      {:description
        (str "Involved in the development and maintenance of a financial web portal, managed to drastically improve the page loading times.\n"
          "Did a case study to discover if changing the web portal framework would bring a clear benefit.\n"
          "Applied a new learned technology to create a financial calculator for customers to calculate their loan payments.")
        :tools ["C#" "Python" "Django" "Adobe Flex"]}}])
