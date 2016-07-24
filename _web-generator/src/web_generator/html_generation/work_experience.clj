(def ^:private format-period-date
  (let [month-year-format (time-format/formatter "MMMM yyyy")]
    (fn [date] (time-format/unparse month-year-format date))))

(defn- period-days
  [period]
  (time/in-days (time/interval (:start period) (:end period))))

(defn- period-months
  [period]
  (int (/ (period-days period) 30)))

(defn- format-period-length
  [period]
  (let [months (period-months period)]
    (str months " month" (if (not= months 1) "s"))))

(defn- format-period
  [period]
  (str (format-period-date (:start period))
    " - "
    (format-period-date (:end period))
    ", "
    (format-period-length period)))

(defn- company-name-&-description-html
  [company-name company-description]
  [:p.company-description (list [:span.company-name company-name])
       (str ". " company-description)])

(defn- tools-html
  [tools]
  (into [:p.tools [:b "Tools used:"]]
        (map #(vector :span.tool %) tools)))

(defn- work-experience-entry-html
  [work-experience-entry]
  [:div.job-entry
     [:h2.job-title (:job-title work-experience-entry)]
     (company-name-&-description-html
       (:company-name work-experience-entry)
       (:company-description work-experience-entry))
     [:p.period (format-period (:period work-experience-entry))]
     [:p.experience (:experience work-experience-entry)]
     (tools-html (:tools work-experience-entry))])

(defn work-experience-html
  [content]
  [:section (map work-experience-entry-html content)])
