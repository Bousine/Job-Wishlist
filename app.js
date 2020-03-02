class App {
  constructor(){
    this.toDelete = -1
    this.jobs = JSON.parse(localStorage.getItem('jobs')) || []
    this.$form = document.querySelector("#form")
    this.$company = document.querySelector("#company-name")
    this.$jobtitle = document.querySelector("#job-title")
    this.$jobs = document.querySelector("#jobs")
    this.addEventListeners()
    this.render()
  }

  addEventListeners(){
    this.$form.addEventListener('submit', event => {
      event.preventDefault()
      const companyName = this.$company.value
      const jobTitle = this.$jobtitle.value
      const hasJob = companyName || jobTitle

      if(hasJob){
        this.addJob({companyName, jobTitle})
      }
      this.$company.value = ''
      this.$jobtitle.value = ''
      $("#jobModal").modal('hide')
    })

    document.body.addEventListener('click', event => {
      this.popUpModal(event)
      this.deleteJob(event)
    })



  }

  addJob(job){
    const color = randomColor()
    const newJob = {
      companyName: job.companyName,
      jobTitle: job.jobTitle,
      id: this.jobs.length > 0 ? this.jobs[this.jobs.length - 1].id + 1 : 1,
      color: color,
      date: Date.now()
    }
    this.jobs = [...this.jobs, newJob]
    this.render()
  }
  popUpModal(event){
    if(!event.target.matches('.toolbar-delete')) return
    this.toDelete = Number(event.target.dataset.id)
    $('#del-dialog').modal('show')
  }
  deleteJob(event, toDelete){
    if(!event.target.matches('#del-button')) return
    console.log(this.toDelete)
    this.jobs = this.jobs.filter(job => job.id !== this.toDelete)
    $("#del-dialog").modal('hide')
    this.render()
  }

  displayJobs(){
    let suffix = this.jobs.length > 1 ? "JOBS" : "JOB"
    $("#num-jobs").text(`${this.jobs.length} ${suffix}`)
    this.$jobs.innerHTML = this.jobs.map(job => `
      <div class="job card" data-id="${job.id}" style="width: 100%; background-color: ${job.color};">
      <div class="card-body">
        <div class="company-name card-title" style="font-size: x-large; font-weight: bold">${job.companyName}</div>
        <div class="job-title card-subtitle" style="font-size: medium; font-weight: 500">${job.jobTitle}</div>
        <div class="date">Added ${timeSince(new Date(job.date))} ago</div>
        <div class="toolbar-container">
          <div class="toolbar">
            <img id="job-${job.id}" data-id="${job.id}" class="toolbar-delete" src="https://icon.now.sh/delete">
          </div>
        </div>
      </div>
      </div>
    `).join("")

  }

  saveJobs(){
    localStorage.setItem('jobs', JSON.stringify(this.jobs))
  }

  render(){
    this.displayJobs()
    this.saveJobs()
  }

}

new App()

function timeSince(date) {

  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return interval + " years";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " months";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " days";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " hours";
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}
