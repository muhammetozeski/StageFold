using StageFold.Core;
namespace StageFold.App.Services;

public sealed class AccountInfo {public string Id{get;set;}="";public string Alias{get;set;}="";public bool Premium{get;set;}public long CreatedAt{get;set;}}
public sealed class AccountReply {public AccountInfo? Account{get;set;}public string? RecoveryKey{get;set;}}
public sealed class OkReply {public bool Ok{get;set;}}
public sealed class ProjectInfo {public string Id{get;set;}="";public string Title{get;set;}="";public Film Film{get;set;}=new();public int Revision{get;set;}public string Role{get;set;}="viewer";public string? ParentCut{get;set;}public ParentCutInfo? Parent{get;set;}public long UpdatedAt{get;set;}public long CreatedAt{get;set;}}
public sealed class ProjectReply {public ProjectInfo Project{get;set;}=new();public int? SavedRevision{get;set;}}
public sealed class ProjectsReply {public ProjectInfo[] Projects{get;set;}=[];public AccountAllowance Account{get;set;}=new();}
public sealed class AccountAllowance {public int ProjectLimit{get;set;}public int UsedProjects{get;set;}}
public sealed class InviteReply {public string Token{get;set;}="";public long ExpiresAt{get;set;}}
public sealed class JoinReply {public string ProjectId{get;set;}="";public string Role{get;set;}="";}
public sealed class MemberInfo {public string Id{get;set;}="";public string Alias{get;set;}="";public string Role{get;set;}="";public long JoinedAt{get;set;}}
public sealed class MembersReply {public MemberInfo[] Members{get;set;}=[];}
public sealed class HistoryInfo {public int Revision{get;set;}public long SavedAt{get;set;}public string? AuthorAlias{get;set;}}
public sealed class HistoryReply {public HistoryInfo[] Versions{get;set;}=[];}
public sealed class VersionReply {public SavedVersion Version{get;set;}=new();}
public sealed class SavedVersion {public int Revision{get;set;}public Film Film{get;set;}=new();public long SavedAt{get;set;}}
public sealed class CutInfo {public string Id{get;set;}="";public string Title{get;set;}="";public string Summary{get;set;}="";public string AuthorAlias{get;set;}="";public string? ParentCut{get;set;}public string BodyHash{get;set;}="";public string License{get;set;}="";public long CreatedAt{get;set;}public bool Owned{get;set;}public bool Withdrawn{get;set;}public bool Hidden{get;set;}public Film? Film{get;set;}public CutChanges? Changes{get;set;}public ParentCutInfo? Parent{get;set;}}
public sealed class ParentCutInfo {public string Id{get;set;}="";public string Title{get;set;}="";public string AuthorAlias{get;set;}="";public string License{get;set;}="";public string BodyHash{get;set;}="";public bool Available{get;set;}}
public sealed class CutChanges {public bool Original{get;set;}public bool CastChanged{get;set;}public string[] ChangedShots{get;set;}=[];public string[] AddedShots{get;set;}=[];public string[] RemovedShots{get;set;}=[];public int DurationBefore{get;set;}public int DurationAfter{get;set;}}
public sealed class CutReply {public CutInfo Cut{get;set;}=new();}
public sealed class CutsReply {public CutInfo[] Cuts{get;set;}=[];public bool HasMore{get;set;}}
public sealed class InviteInfo {public string Id{get;set;}="";public string Role{get;set;}="";public long ExpiresAt{get;set;}public bool Used{get;set;}public long? RevokedAt{get;set;}}
public sealed class InvitesReply {public InviteInfo[] Invites{get;set;}=[];}
