(def work-experience
  [{:job-title "Software developer"
    :company
      {:name "Afi"
       :description "Afi is a leading Spanish provider of advisory, consultancy and training services in economics and finance."}
    :period
      {:start (time/date-time 2008 10 1)
       :end (time/date-time 2009 6 30)}
    :experience
      [{:description
        (str "Involved in the development and maintenance of a financial web portal, managed to drastically improve the page loading times.\n"
          "Did a case study to discover if changing the web portal framework would bring a clear benefit.\n"
          "Applied a new learned technology to create a financial calculator for customers to calculate their loan payments.")
        :tools ["C#" "Python" "Django" "Adobe Flex"]}]}])
