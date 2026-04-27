from marshmallow import EXCLUDE, Schema, fields, post_load

class AuthorInfoSchema(Schema):
    name = fields.Str(required=True)
    phone_number = fields.Str(required=True)
    company_name = fields.Str(allow_none=True)

class UserSchema(Schema):
    """Schema for a user (login/register)"""
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    email = fields.Str(required=True)
    password = fields.Str(required=True, load_only=True)
    role = fields.Str(required=True)
    phone_number = fields.Str()
    company_name = fields.Str()

class UserLoginSchema(Schema):
    name = fields.Str(required=True)
    password = fields.Str(required=True, load_only=True)

class UserUpdateSchema(Schema):
    name = fields.Str()
    email = fields.Email()
    phone_number = fields.Str()
    company_name = fields.Str()

class UserForJobSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(dump_only=True)
    phone_number = fields.Str(dump_only=True)
    company_name = fields.Str(dump_only=True)
class PlainJobSchema(Schema):
    """Schema for job"""
    id = fields.Int(dump_only=True)
    short_description = fields.Str(required=True)
    long_description = fields.Str(required=True)
    category = fields.Str(required=True)
    subcategory = fields.Str(required=True)
    payment = fields.Int()
    currency = fields.Str()
    image = fields.Str(required=False)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    agreement_type = fields.Str()
    location = fields.Str()
    experience_requirement = fields.Str()
    transport_availability = fields.Str()
    schedule = fields.Str()
    additional_requirements = fields.Str()
    type_of_work = fields.Str()
    author_info = fields.Nested(AuthorInfoSchema, load_only=True)
    job_author_name = fields.Str(dump_only=True)
    job_phone_number = fields.Str(dump_only=True)
    job_company_name = fields.Str(dump_only=True)
    user = fields.Nested(UserForJobSchema(), dump_only=True)

    @post_load
    def process_author_info(self, data, **kwargs):
        if "author_info" in data:
            info = data.pop("author_info")
            data["job_author_name"] = info.get("name")
            data["job_phone_number"] = info.get("phone_number")
            data["job_company_name"] = info.get("company_name")
        return data

class JobSchema(PlainJobSchema):
    author = fields.Nested(UserSchema(), dump_only=True)