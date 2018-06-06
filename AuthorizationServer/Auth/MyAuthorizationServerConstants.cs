namespace AuthorizationServer.Auth
{
    public static class MyAuthorizationServerConstants
    {
        public static class Scopes
        {
            public const string ResourceServer1Api = nameof(ResourceServer1Api);

            public const string ResourceServer2Api = nameof(ResourceServer2Api);
        }

        public static class Resource
        {
            public const string ResourceServer1 = nameof(ResourceServer1);

            public const string ResourceServer2 = nameof(ResourceServer2);
        }
    }
}