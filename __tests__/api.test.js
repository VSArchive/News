import login from '../pages/api/login'
import getUserInfo from '../pages/api/getUserInfo'
import createArticle from '../pages/api/createArticle'
import editArticle from '../pages/api/editArticle'

jest.setTimeout(60000)
// jest.useFakeTimers()

test('Test Login', async () => {
    const req = {
        body: {
            email: "vineelsai26@gmail.com"
        },
        method: "POST"
    }

    const json = jest.fn()

    const status = jest.fn(() => {
        return {
            json
        }
    })

    const res = {
        status
    }

    await login(req, res)

    expect(json.mock.calls[0][0].email).toEqual(req.body.email)
})

test('Get user info', async () => {
    const req = {
        body: {
            id: "63414ea87e8921c360f9d5af"
        },
        method: "POST"
    }

    const json = jest.fn()

    const status = jest.fn(() => {
        return {
            json
        }
    })

    const res = {
        status
    }

    await getUserInfo(req, res)

    expect(json.mock.calls[0][0].email).toEqual("vineelsai26@gmail.com")
})

test('Create Post', async () => {
    const req = {
        body: {
            title: "Test Post",
            url: "test-post",
            imageUrl: "test",
            description: "test",
            content: "test",
            email: "vineelsai26@gmail.com"
        },
        method: "POST"
    }

    const json = jest.fn()

    const status = jest.fn(() => {
        return {
            json
        }
    })

    const res = {
        status
    }

    await createArticle(req, res)

    expect(json.mock.calls[0][0].url).toEqual(req.body.url)
})

test('Delete Post', async () => {
    const req = {
        body: {
            url: "test-post",
            email: "vineelsai26@gmail.com",
            delete: "true"
        },
        method: "POST"
    }

    const json = jest.fn()

    const status = jest.fn(() => {
        return {
            json
        }
    })

    const res = {
        status
    }

    await editArticle(req, res)

    expect(json.mock.calls[0][0].success).toEqual("Article deleted successfully")
})
