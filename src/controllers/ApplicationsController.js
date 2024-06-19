import ApplicationsModel from '../models/ApplicationsModel.js'
import UserModel from '../models/UserModel.js'

export const getMyApplications = async (req, res) => {
  try {
    const userId = req.query.userId

    const applications = await ApplicationsModel.find({
      responsibleUser: userId,
    })

    if (!applications) {
      res.status(500).json({ message: 'error while fetch applications' })
      return
    }

    res.status(200).json(applications)
  } catch (error) {
    console.log('error while get my applications')
  }
}

export const getEmployeesApplications = async (req, res) => {
  try {
    const organizationId = req.query.organizationId
    const employeesInOrganization = await UserModel.find({
      organizationId: organizationId,
    })

    const employeesTasks = []

    for (let i = 0; i < employeesInOrganization.length; i++) {
      const employeeTasks = await ApplicationsModel.find({
        responsibleUser: employeesInOrganization[i]._id,
      })

      employeeTasks.push({
        user: employeesInOrganization[i],
        tasks: employeeTasks,
      })
    }

    res.status(200).json(employeesTasks)
  } catch (error) {
    console.log('error while get employees applications')
  }
}

export const getIncomingApplications = async (req, res) => {
  try {
    const organizationId = req.query.organizationId

    const incomingApplications = await ApplicationsModel.find({
      organizationId: organizationId,
      responsibleUser: null,
    })

    res.status(200).json(incomingApplications)
  } catch (error) {
    console.log('error while get incomingApplications')
  }
}

export const createApplication = async (req, res) => {
  try {
    const organizationId = req.body.organizationId
    const tasks = req.body.tasks
    const userOrganizationTitle = req.body.organizationTitle

    const newApplication = await ApplicationsModel.create({
      organizationId: organizationId,
      status: 0,
      tasks: tasks,
      title: userOrganizationTitle,
      responsibleUser: null,
    })

    await newApplication.save()

    console.log('create')

    res.status(200).json(newApplication)
  } catch (error) {
    console.log('error while create application')
  }
}

export const updateApplication = async (req, res) => {
  try {
    const status = req.body.status
    const responsibleUserId = req.body.responsibleUserId
    const applicationId = req.body.applicationId

    await ApplicationsModel.updateOne(
      {
        _id: applicationId,
      },
      {
        responsibleUser: responsibleUserId,
        status: status,
      },
    )

    const updatedApplication = await ApplicationsModel.findById(applicationId)

    res.status(200).json(updatedApplication)
  } catch (error) {
    console.log('error while update application')
  }
}

export const removeApplication = async (req, res) => {
  try {
    const applicationId = req.body.applicationId

    const deletedApplication =
      await ApplicationsModel.findByIdAndDelete(applicationId)

    await deletedApplication.save()

    res.status(200).json(deletedApplication)
  } catch (error) {
    console.log('error while remove application')
  }
}
